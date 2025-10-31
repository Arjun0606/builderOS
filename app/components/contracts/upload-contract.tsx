'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UploadContractProps {
  organizationId: string
}

export function UploadContract({ organizationId }: UploadContractProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    contractType: 'contractor',
    counterparty: '',
    projectId: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.pdf')) {
        setError('Please upload a PDF file')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !formData.counterparty || !formData.projectId) {
      setError('Please fill all fields')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Upload PDF to Supabase Storage
      const filePath = `${organizationId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('contracts')
        .getPublicUrl(filePath)

      // Create contract record
      const { data: contract, error: insertError } = await supabase
        .from('contracts')
        .insert({
          organization_id: organizationId,
          project_id: formData.projectId,
          contract_type: formData.contractType,
          counterparty: formData.counterparty,
          file_url: publicUrl,
          page_count: null, // Will be updated after analysis
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Trigger analysis (call Edge Function)
      const { error: analysisError } = await supabase.functions.invoke('analyze-contract', {
        body: { contractId: contract.id },
      })

      if (analysisError) {
        console.error('Analysis error:', analysisError)
        // Don't throw - contract is uploaded, analysis can be retried
      }

      // Reset form
      setFile(null)
      setFormData({ contractType: 'contractor', counterparty: '', projectId: '' })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Refresh page
      router.refresh()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload contract')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Upload Contract
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            AI will analyze in ~60 seconds and flag risky clauses
          </p>
        </div>
        <FileText className="h-6 w-6 text-slate-400" />
      </div>

      <div className="mt-6 space-y-4">
        {/* Form Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Contract Type *
            </label>
            <select
              className="mt-2 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
              value={formData.contractType}
              onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
            >
              <option value="contractor">Contractor Agreement</option>
              <option value="supplier">Supplier Contract</option>
              <option value="consultant">Consultant Agreement</option>
              <option value="loan">Loan Document</option>
              <option value="lease">Lease Agreement</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Counterparty *
            </label>
            <input
              type="text"
              placeholder="e.g., Sharma Constructions"
              className="mt-2 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
              value={formData.counterparty}
              onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })}
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            PDF File *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition-colors hover:border-slate-400 hover:bg-slate-100"
          >
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-900">
                {file ? file.name : 'Click to upload PDF'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Max 50 MB • Supports scanned documents (OCR)
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

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || !formData.counterparty || !formData.projectId || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Contract...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Analyze
            </>
          )}
        </Button>

        {/* Info */}
        <div className="rounded-md bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-900">What AI checks:</p>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>✓ RERA compliance violations</li>
            <li>✓ Risky penalty clauses</li>
            <li>✓ Missing critical clauses (insurance, force majeure)</li>
            <li>✓ Cross-reference with Indian legal cases</li>
            <li>✓ Financial exposure calculation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

