-- Cost Guard: Duplicate Detection & Anomaly Analysis Functions
-- Run this after schema.sql

-- Function to detect duplicate invoices using AI logic
CREATE OR REPLACE FUNCTION detect_duplicates(org_id UUID)
RETURNS TABLE (
  invoice_id UUID,
  duplicate_count INTEGER,
  confidence_score DECIMAL,
  reason TEXT
) AS $$
BEGIN
  -- Find exact duplicates (same supplier + same invoice number)
  UPDATE invoices SET
    is_duplicate = TRUE,
    flagged_by_cost_guard = TRUE,
    flag_reason = 'Exact duplicate: Same supplier and invoice number found',
    confidence_score = 100
  WHERE organization_id = org_id
    AND (supplier, invoice_number) IN (
      SELECT supplier, invoice_number
      FROM invoices
      WHERE organization_id = org_id
      GROUP BY supplier, invoice_number
      HAVING COUNT(*) > 1
    );

  -- Find near-duplicates (same supplier + similar amount + close date)
  UPDATE invoices i1 SET
    is_duplicate = TRUE,
    flagged_by_cost_guard = TRUE,
    flag_reason = 'Possible duplicate: Same supplier, similar amount (' || 
      (SELECT amount FROM invoices i2 
       WHERE i2.organization_id = org_id 
         AND i2.supplier = i1.supplier 
         AND ABS(i2.amount - i1.amount) < (i1.amount * 0.05)
         AND ABS(EXTRACT(DAY FROM i2.date - i1.date)) <= 7
         AND i2.id != i1.id
       LIMIT 1) || '), within 7 days',
    confidence_score = 85
  WHERE organization_id = org_id
    AND EXISTS (
      SELECT 1 FROM invoices i2
      WHERE i2.organization_id = org_id
        AND i2.supplier = i1.supplier
        AND i2.id != i1.id
        AND ABS(i2.amount - i1.amount) < (i1.amount * 0.05) -- Within 5% of amount
        AND ABS(EXTRACT(DAY FROM i2.date - i1.date)) <= 7   -- Within 7 days
    );

  -- Return flagged invoices
  RETURN QUERY
  SELECT 
    id AS invoice_id,
    1 AS duplicate_count,
    confidence_score,
    flag_reason AS reason
  FROM invoices
  WHERE organization_id = org_id
    AND flagged_by_cost_guard = TRUE
    AND created_at > NOW() - INTERVAL '5 minutes'; -- Only recent flagged ones

END;
$$ LANGUAGE plpgsql;

-- Function to detect rate anomalies (price drift)
CREATE OR REPLACE FUNCTION detect_rate_anomalies(org_id UUID)
RETURNS TABLE (
  invoice_id UUID,
  category VARCHAR,
  current_rate DECIMAL,
  avg_rate DECIMAL,
  deviation_percent DECIMAL
) AS $$
BEGIN
  -- For each category, find invoices that deviate significantly from historical average
  WITH category_stats AS (
    SELECT 
      category,
      AVG(amount) as avg_amount,
      STDDEV(amount) as stddev_amount
    FROM invoices
    WHERE organization_id = org_id
      AND category IS NOT NULL
    GROUP BY category
    HAVING COUNT(*) >= 5 -- Need at least 5 samples
  )
  UPDATE invoices i SET
    flagged_by_cost_guard = TRUE,
    flag_reason = 'Rate anomaly: ' || ROUND(((i.amount - cs.avg_amount) / cs.avg_amount * 100)::numeric, 1) || 
                  '% deviation from average ₹' || ROUND(cs.avg_amount::numeric, 2),
    confidence_score = 
      CASE 
        WHEN ABS(i.amount - cs.avg_amount) > (cs.stddev_amount * 3) THEN 95
        WHEN ABS(i.amount - cs.avg_amount) > (cs.stddev_amount * 2) THEN 80
        ELSE 65
      END
  FROM category_stats cs
  WHERE i.organization_id = org_id
    AND i.category = cs.category
    AND ABS(i.amount - cs.avg_amount) > (cs.stddev_amount * 2) -- 2 standard deviations
    AND i.created_at > NOW() - INTERVAL '5 minutes';

  RETURN QUERY
  SELECT 
    i.id,
    i.category,
    i.amount,
    cs.avg_amount,
    ((i.amount - cs.avg_amount) / cs.avg_amount * 100) as deviation_percent
  FROM invoices i
  JOIN category_stats cs ON i.category = cs.category
  WHERE i.organization_id = org_id
    AND i.flagged_by_cost_guard = TRUE
    AND i.created_at > NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to validate GST rates
CREATE OR REPLACE FUNCTION validate_gst_rates(org_id UUID)
RETURNS TABLE (
  invoice_id UUID,
  category VARCHAR,
  applied_gst DECIMAL,
  correct_gst DECIMAL
) AS $$
BEGIN
  -- Common GST rates in India
  -- Cement: 28%, Steel: 18%, Electrical: 12%, Labor: 18%, etc.
  
  UPDATE invoices SET
    flagged_by_cost_guard = TRUE,
    flag_reason = 'GST rate error: Applied ' || gst_rate || '%, should be ' ||
      CASE 
        WHEN category ILIKE '%cement%' THEN '28'
        WHEN category ILIKE '%steel%' THEN '18'
        WHEN category ILIKE '%electrical%' THEN '12'
        WHEN category ILIKE '%labor%' OR category ILIKE '%labour%' THEN '18'
        ELSE '18'
      END || '%',
    confidence_score = 95
  WHERE organization_id = org_id
    AND gst_rate IS NOT NULL
    AND (
      (category ILIKE '%cement%' AND gst_rate != 28) OR
      (category ILIKE '%steel%' AND gst_rate != 18) OR
      (category ILIKE '%electrical%' AND gst_rate != 12) OR
      ((category ILIKE '%labor%' OR category ILIKE '%labour%') AND gst_rate != 18)
    )
    AND created_at > NOW() - INTERVAL '5 minutes';

  RETURN QUERY
  SELECT 
    id,
    category,
    gst_rate,
    CASE 
      WHEN category ILIKE '%cement%' THEN 28::decimal
      WHEN category ILIKE '%steel%' THEN 18::decimal
      WHEN category ILIKE '%electrical%' THEN 12::decimal
      WHEN category ILIKE '%labor%' OR category ILIKE '%labour%' THEN 18::decimal
      ELSE 18::decimal
    END as correct_gst
  FROM invoices
  WHERE organization_id = org_id
    AND flagged_by_cost_guard = TRUE
    AND created_at > NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Main Cost Guard analysis function (runs all checks)
CREATE OR REPLACE FUNCTION run_cost_guard_analysis(org_id UUID)
RETURNS JSONB AS $$
DECLARE
  duplicate_count INTEGER;
  anomaly_count INTEGER;
  gst_error_count INTEGER;
  result JSONB;
BEGIN
  -- Run all detection functions
  PERFORM detect_duplicates(org_id);
  PERFORM detect_rate_anomalies(org_id);
  PERFORM validate_gst_rates(org_id);

  -- Count results
  SELECT COUNT(*) INTO duplicate_count
  FROM invoices
  WHERE organization_id = org_id
    AND is_duplicate = TRUE
    AND created_at > NOW() - INTERVAL '5 minutes';

  SELECT COUNT(*) INTO anomaly_count
  FROM invoices
  WHERE organization_id = org_id
    AND flagged_by_cost_guard = TRUE
    AND flag_reason ILIKE '%anomaly%'
    AND created_at > NOW() - INTERVAL '5 minutes';

  SELECT COUNT(*) INTO gst_error_count
  FROM invoices
  WHERE organization_id = org_id
    AND flagged_by_cost_guard = TRUE
    AND flag_reason ILIKE '%gst%'
    AND created_at > NOW() - INTERVAL '5 minutes';

  -- Build result
  result := jsonb_build_object(
    'duplicates', duplicate_count,
    'anomalies', anomaly_count,
    'gst_errors', gst_error_count,
    'total_flagged', duplicate_count + anomaly_count + gst_error_count,
    'analyzed_at', NOW()
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION detect_duplicates(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION detect_rate_anomalies(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_gst_rates(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION run_cost_guard_analysis(UUID) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Cost Guard functions created successfully! ✅';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '  - detect_duplicates(org_id)';
  RAISE NOTICE '  - detect_rate_anomalies(org_id)';
  RAISE NOTICE '  - validate_gst_rates(org_id)';
  RAISE NOTICE '  - run_cost_guard_analysis(org_id)';
END $$;

