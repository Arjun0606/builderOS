-- BuilderOS Metrics & Health Score Functions
-- Run this after main schema

-- ============================================
-- ROI CALCULATION FUNCTIONS
-- ============================================

-- Calculate Cost Guard savings for an organization
CREATE OR REPLACE FUNCTION get_cost_guard_savings(org_id UUID, time_period TEXT DEFAULT 'all')
RETURNS NUMERIC AS $$
DECLARE
  savings NUMERIC := 0;
  date_filter TIMESTAMP;
BEGIN
  -- Set date filter based on period
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'month' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE date_filter := '1900-01-01'; -- All time
  END CASE;

  -- Sum up all flagged amounts (duplicates, errors, anomalies)
  SELECT COALESCE(SUM(amount), 0)
  INTO savings
  FROM invoices
  WHERE organization_id = org_id
    AND flagged_by_cost_guard = true
    AND created_at >= date_filter;

  RETURN savings;
END;
$$ LANGUAGE plpgsql;

-- Calculate RERA savings (penalties avoided + consultant fees)
CREATE OR REPLACE FUNCTION get_rera_savings(org_id UUID, time_period TEXT DEFAULT 'all')
RETURNS NUMERIC AS $$
DECLARE
  penalty_savings NUMERIC := 0;
  consultant_savings NUMERIC := 0;
  total_savings NUMERIC := 0;
  date_filter TIMESTAMP;
BEGIN
  -- Set date filter
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'month' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE date_filter := '1900-01-01';
  END CASE;

  -- Penalties avoided (critical RERA updates caught)
  SELECT COUNT(*) * 5000000 -- ₹50L per penalty avoided
  INTO penalty_savings
  FROM rera_updates
  WHERE severity = 'critical'
    AND detected_at >= date_filter;

  -- Consultant fees saved (QPRs generated)
  SELECT COUNT(*) * 75000 -- ₹75K per QPR saved
  INTO consultant_savings
  FROM qpr_drafts q
  JOIN projects p ON q.project_id = p.id
  WHERE p.organization_id = org_id
    AND q.created_at >= date_filter
    AND q.status IN ('reviewed', 'submitted');

  total_savings := penalty_savings + consultant_savings;
  RETURN total_savings;
END;
$$ LANGUAGE plpgsql;

-- Calculate Contract savings (risks flagged + lawyer fees saved)
CREATE OR REPLACE FUNCTION get_contract_savings(org_id UUID, time_period TEXT DEFAULT 'all')
RETURNS NUMERIC AS $$
DECLARE
  risk_savings NUMERIC := 0;
  lawyer_savings NUMERIC := 0;
  total_savings NUMERIC := 0;
  date_filter TIMESTAMP;
BEGIN
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'month' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE date_filter := '1900-01-01';
  END CASE;

  -- Risk savings (critical issues flagged, avg ₹1 Cr per issue)
  SELECT SUM(critical_issues) * 10000000 -- ₹1 Cr per critical issue
  INTO risk_savings
  FROM contracts
  WHERE organization_id = org_id
    AND created_at >= date_filter;

  -- Lawyer fees saved (₹1.5L per contract)
  SELECT COUNT(*) * 150000
  INTO lawyer_savings
  FROM contracts
  WHERE organization_id = org_id
    AND created_at >= date_filter;

  total_savings := COALESCE(risk_savings, 0) + COALESCE(lawyer_savings, 0);
  RETURN total_savings;
END;
$$ LANGUAGE plpgsql;

-- Calculate Cash Command Center savings
CREATE OR REPLACE FUNCTION get_cash_savings(org_id UUID, time_period TEXT DEFAULT 'all')
RETURNS NUMERIC AS $$
DECLARE
  escrow_savings NUMERIC := 100000; -- ₹1L per month (avg escrow violation avoided)
  time_savings NUMERIC := 60000; -- ₹60K per month (staff time saved)
  total_savings NUMERIC := 0;
  months_active INT := 1;
BEGIN
  -- Calculate months since first cash analysis
  SELECT EXTRACT(MONTH FROM AGE(NOW(), MIN(created_at)))::INT + 1
  INTO months_active
  FROM cash_flow_analyses
  WHERE organization_id = org_id;

  CASE time_period
    WHEN 'week' THEN total_savings := (escrow_savings + time_savings) / 4;
    WHEN 'month' THEN total_savings := escrow_savings + time_savings;
    WHEN 'year' THEN total_savings := (escrow_savings + time_savings) * 12;
    ELSE total_savings := (escrow_savings + time_savings) * GREATEST(months_active, 1);
  END CASE;

  RETURN total_savings;
END;
$$ LANGUAGE plpgsql;

-- Get total ROI metrics
CREATE OR REPLACE FUNCTION get_roi_metrics(org_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  cost_guard_week NUMERIC;
  cost_guard_month NUMERIC;
  cost_guard_all NUMERIC;
  rera_week NUMERIC;
  rera_month NUMERIC;
  rera_all NUMERIC;
  contract_week NUMERIC;
  contract_month NUMERIC;
  contract_all NUMERIC;
  cash_week NUMERIC;
  cash_month NUMERIC;
  cash_all NUMERIC;
  total_week NUMERIC;
  total_month NUMERIC;
  total_all NUMERIC;
  builderos_cost NUMERIC;
  roi NUMERIC;
BEGIN
  -- Get all savings by period
  cost_guard_week := get_cost_guard_savings(org_id, 'week');
  cost_guard_month := get_cost_guard_savings(org_id, 'month');
  cost_guard_all := get_cost_guard_savings(org_id, 'all');

  rera_week := get_rera_savings(org_id, 'week');
  rera_month := get_rera_savings(org_id, 'month');
  rera_all := get_rera_savings(org_id, 'all');

  contract_week := get_contract_savings(org_id, 'week');
  contract_month := get_contract_savings(org_id, 'month');
  contract_all := get_contract_savings(org_id, 'all');

  cash_week := get_cash_savings(org_id, 'week');
  cash_month := get_cash_savings(org_id, 'month');
  cash_all := get_cash_savings(org_id, 'all');

  -- Calculate totals
  total_week := cost_guard_week + rera_week + contract_week + cash_week;
  total_month := cost_guard_month + rera_month + contract_month + cash_month;
  total_all := cost_guard_all + rera_all + contract_all + cash_all;

  -- Calculate ROI (assume ₹1L/month cost per project)
  SELECT COUNT(*) * 100000 INTO builderos_cost FROM projects WHERE organization_id = org_id;
  roi := CASE WHEN builderos_cost > 0 THEN total_all / builderos_cost ELSE 0 END;

  -- Build result JSON
  result := json_build_object(
    'this_week', json_build_object(
      'cost_guard', cost_guard_week,
      'rera', rera_week,
      'contracts', contract_week,
      'cash', cash_week,
      'total', total_week
    ),
    'this_month', json_build_object(
      'cost_guard', cost_guard_month,
      'rera', rera_month,
      'contracts', contract_month,
      'cash', cash_month,
      'total', total_month
    ),
    'all_time', json_build_object(
      'cost_guard', cost_guard_all,
      'rera', rera_all,
      'contracts', contract_all,
      'cash', cash_all,
      'total', total_all
    ),
    'roi', roi,
    'builderos_cost', builderos_cost
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- HEALTH SCORE FUNCTIONS
-- ============================================

-- Calculate Financial Health Score (0-100)
CREATE OR REPLACE FUNCTION calculate_financial_score(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 100;
  duplicate_count INTEGER;
  gst_error_count INTEGER;
  anomaly_count INTEGER;
BEGIN
  -- Count issues in last 30 days
  SELECT 
    COUNT(*) FILTER (WHERE is_duplicate = true),
    COUNT(*) FILTER (WHERE flag_reason ILIKE '%gst%'),
    COUNT(*) FILTER (WHERE flag_reason ILIKE '%anomaly%')
  INTO duplicate_count, gst_error_count, anomaly_count
  FROM invoices
  WHERE organization_id = org_id
    AND flagged_by_cost_guard = true
    AND created_at >= NOW() - INTERVAL '30 days';

  -- Deduct points
  score := score - (duplicate_count * 5);
  score := score - (gst_error_count * 3);
  score := score - (anomaly_count * 2);

  RETURN GREATEST(score, 0);
END;
$$ LANGUAGE plpgsql;

-- Calculate Compliance Health Score (0-100)
CREATE OR REPLACE FUNCTION calculate_compliance_score(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 100;
  critical_alerts INTEGER;
  upcoming_deadlines INTEGER;
  pending_qprs INTEGER;
BEGIN
  -- Count critical RERA alerts not resolved
  SELECT COUNT(*)
  INTO critical_alerts
  FROM rera_updates
  WHERE severity = 'critical'
    AND notified = false
    AND detected_at >= NOW() - INTERVAL '30 days';

  -- Count upcoming deadlines (next 7 days)
  SELECT COUNT(*)
  INTO upcoming_deadlines
  FROM qpr_drafts q
  JOIN projects p ON q.project_id = p.id
  WHERE p.organization_id = org_id
    AND q.status = 'draft'
    AND q.created_at >= NOW() - INTERVAL '7 days';

  -- Deduct points
  score := score - (critical_alerts * 50);
  score := score - (upcoming_deadlines * 10);

  RETURN GREATEST(score, 0);
END;
$$ LANGUAGE plpgsql;

-- Calculate Contract Health Score (0-100)
CREATE OR REPLACE FUNCTION calculate_contract_score(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 100;
  critical_issues INTEGER;
  moderate_issues INTEGER;
  unreviewed INTEGER;
BEGIN
  -- Count contract issues
  SELECT 
    SUM(critical_issues),
    SUM(moderate_issues),
    COUNT(*) FILTER (WHERE analyzed_at IS NULL)
  INTO critical_issues, moderate_issues, unreviewed
  FROM contracts
  WHERE organization_id = org_id
    AND created_at >= NOW() - INTERVAL '90 days';

  -- Deduct points
  score := score - (COALESCE(critical_issues, 0) * 20);
  score := score - (COALESCE(moderate_issues, 0) * 10);
  score := score - (COALESCE(unreviewed, 0) * 15);

  RETURN GREATEST(score, 0);
END;
$$ LANGUAGE plpgsql;

-- Calculate Cash Flow Health Score (0-100)
CREATE OR REPLACE FUNCTION calculate_cash_score(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 100;
  escrow_utilization NUMERIC;
  critical_alerts INTEGER;
BEGIN
  -- Get latest escrow utilization
  SELECT escrow_utilization_percentage
  INTO escrow_utilization
  FROM cash_flow_analyses
  WHERE organization_id = org_id
  ORDER BY created_at DESC
  LIMIT 1;

  -- Count critical cash alerts
  SELECT COUNT(*)
  INTO critical_alerts
  FROM alerts
  WHERE organization_id = org_id
    AND alert_type = 'cash_flow'
    AND severity = 'critical'
    AND is_resolved = false;

  -- Deduct points
  IF escrow_utilization > 90 THEN
    score := score - 20;
  ELSIF escrow_utilization > 80 THEN
    score := score - 10;
  END IF;

  score := score - (COALESCE(critical_alerts, 0) * 15);

  RETURN GREATEST(score, 0);
END;
$$ LANGUAGE plpgsql;

-- Get complete health metrics
CREATE OR REPLACE FUNCTION get_health_metrics(org_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  financial INTEGER;
  compliance INTEGER;
  contracts INTEGER;
  cash INTEGER;
  overall INTEGER;
BEGIN
  -- Calculate all scores
  financial := calculate_financial_score(org_id);
  compliance := calculate_compliance_score(org_id);
  contracts := calculate_contract_score(org_id);
  cash := calculate_cash_score(org_id);

  -- Calculate weighted overall score
  overall := ROUND(
    (financial * 0.30) +
    (compliance * 0.30) +
    (contracts * 0.25) +
    (cash * 0.15)
  );

  -- Build result
  result := json_build_object(
    'overall', overall,
    'financial', financial,
    'compliance', compliance,
    'contracts', contracts,
    'cash_flow', cash,
    'status', CASE
      WHEN overall >= 90 THEN 'excellent'
      WHEN overall >= 70 THEN 'good'
      WHEN overall >= 50 THEN 'warning'
      ELSE 'critical'
    END
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_roi_metrics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_health_metrics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_financial_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_compliance_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_contract_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_cash_score(UUID) TO authenticated;

