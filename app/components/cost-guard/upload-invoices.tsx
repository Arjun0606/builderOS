'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import Papa from 'papaparse'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UploadInvoicesProps {
  organizationId: string
}

export function UploadInvoices({ organizationId }: UploadInvoicesProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ count: number; flagged: number } | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file')
        return
      }
      setFile(selectedFile)
      setError(null)
      setSuccess(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      // Parse CSV
      const text = await file.text()
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      })

      if (result.errors.length > 0) {
        throw new Error('Failed to parse CSV file')
      }

      const rows = result.data as any[]

      // Validate required columns
      const requiredColumns = ['supplier', 'amount', 'invoice_number', 'date']
      const headers = Object.keys(rows[0] || {}).map((h) => h.toLowerCase())
      const missing = requiredColumns.filter((col) => !headers.includes(col))

      if (missing.length > 0) {
        throw new Error(`Missing required columns: ${missing.join(', ')}`)
      }

      const supabase = createClient()

      // Get first project for this org (for demo purposes)
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('organization_id', organizationId)
        .limit(1)

      if (!projects || projects.length === 0) {
        throw new Error('Please create a project first')
      }

      const projectId = projects[0].id

      // Process invoices with duplicate detection
      const invoices = rows.map((row) => ({
        organization_id: organizationId,
        project_id: projectId,
        supplier: row.supplier || row.Supplier,
        amount: parseFloat(row.amount || row.Amount),
        invoice_number: row.invoice_number || row['Invoice Number'] || row.invoice_no,
        date: row.date || row.Date,
        category: row.category || row.Category || null,
        gst_rate: row.gst_rate ? parseFloat(row.gst_rate) : null,
        tds_rate: row.tds_rate ? parseFloat(row.tds_rate) : null,
      }))

      // Insert invoices
      const { error: insertError } = await supabase
        .from('invoices')
        .insert(invoices)

      if (insertError) throw insertError

      // Run duplicate detection
      const { data: flaggedInvoices } = await supabase.rpc('detect_duplicates', {
        org_id: organizationId,
      })

      setSuccess({
        count: invoices.length,
        flagged: flaggedInvoices?.length || 0,
      })

      // Reset form
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Refresh page
      router.refresh()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload invoices')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Upload Invoices
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Import your Tally CSV export to detect anomalies
          </p>
        </div>
        <FileText className="h-6 w-6 text-slate-400" />
      </div>

      <div className="mt-6 space-y-4">
        {/* File Input */}
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition-colors hover:border-slate-400 hover:bg-slate-100"
          >
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-900">
                {file ? file.name : 'Click to upload CSV'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Required columns: supplier, amount, invoice_number, date
              </p>
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span>
              Uploaded {success.count} invoices. {success.flagged} anomalies detected.
            </span>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Analyze
            </>
          )}
        </Button>

        {/* Format Help */}
        <div className="rounded-md bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-900">CSV Format Example:</p>
          <pre className="mt-2 overflow-x-auto text-xs text-blue-800">
            {`supplier,amount,invoice_number,date,category
Sharma Constructions,820000,SC/2025/1247,2025-10-15,Labor
UltraTech Cement,245000,UC/2025/889,2025-10-20,Materials`}
          </pre>
        </div>
      </div>
    </div>
  )
}

