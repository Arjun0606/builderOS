'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Upload, File, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface KnowledgeBaseUploadProps {
  organizationId: string
}

interface UploadFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export function KnowledgeBaseUpload({ organizationId }: KnowledgeBaseUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClientComponentClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'pending' as const,
      progress: 0,
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB per file
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const processFiles = async () => {
    setIsProcessing(true)

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue

      // Update status to uploading
      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ))

      try {
        const file = files[i].file
        
        // 1. Upload file to Supabase Storage
        const fileName = `${organizationId}/${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        // Update progress
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 50 } : f
        ))

        // 2. Create document record
        const { data: documentData, error: dbError } = await supabase
          .from('documents')
          .insert({
            organization_id: organizationId,
            document_name: file.name,
            document_type: 'knowledge_base',
            file_path: uploadData.path,
            file_size: file.size,
            mime_type: file.type,
          })
          .select()
          .single()

        if (dbError) throw dbError

        // Update progress
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 75 } : f
        ))

        // 3. TODO: Process document (extract text, generate embeddings)
        // This will be done in background job
        await fetch('/api/knowledge-base/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            documentId: documentData.id,
            filePath: uploadData.path,
          }),
        })

        // Mark as success
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'success' as const, progress: 100 } : f
        ))

      } catch (error: any) {
        console.error('Upload error:', error)
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: 'error' as const, 
            error: error.message || 'Upload failed' 
          } : f
        ))
      }
    }

    setIsProcessing(false)
  }

  const totalFiles = files.length
  const uploadedFiles = files.filter(f => f.status === 'success').length
  const failedFiles = files.filter(f => f.status === 'error').length

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Upload Case Documents
        </h2>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg text-blue-600 font-medium">
              Drop files here...
            </p>
          ) : (
            <>
              <p className="text-lg text-slate-900 font-medium">
                Drag & drop case documents here
              </p>
              <p className="mt-2 text-sm text-slate-600">
                or click to browse files
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Supported: PDF, DOC, DOCX, TXT (up to 50MB per file)
              </p>
            </>
          )}
        </div>

        {/* Bulk Upload Tips */}
        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <h4 className="text-sm font-semibold text-blue-900">💡 Pro Tips for Bulk Upload:</h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Organize files in ZIP before uploading (extract first)</li>
            <li>• Name files clearly: "CaseNo-DocumentType.pdf"</li>
            <li>• Include pleadings, orders, judgments for best AI training</li>
            <li>• Upload 50-100 cases at once for faster processing</li>
          </ul>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Files to Upload ({totalFiles})
            </h3>
            {!isProcessing && files.some(f => f.status === 'pending') && (
              <Button onClick={processFiles}>
                <Upload className="mr-2 h-4 w-4" />
                Upload All
              </Button>
            )}
          </div>

          {/* Progress Summary */}
          {isProcessing && (
            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Uploading...
                </span>
                <span className="text-sm text-blue-700">
                  {uploadedFiles}/{totalFiles} completed
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(uploadedFiles / totalFiles) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* File Items */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
              >
                <File className="h-5 w-5 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {item.status === 'uploading' && (
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.error && (
                    <p className="mt-1 text-xs text-red-600">{item.error}</p>
                  )}
                </div>
                <div className="shrink-0">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  {item.status === 'uploading' && (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {(uploadedFiles > 0 || failedFiles > 0) && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              {uploadedFiles > 0 && (
                <span className="text-green-600 font-medium">
                  ✓ {uploadedFiles} uploaded
                </span>
              )}
              {failedFiles > 0 && (
                <span className="text-red-600 font-medium">
                  ✗ {failedFiles} failed
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

