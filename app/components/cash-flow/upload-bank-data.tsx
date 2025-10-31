'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface UploadBankDataProps {
  onUploadComplete: () => void;
}

export function UploadBankData({ onUploadComplete }: UploadBankDataProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one bank statement file');
      return;
    }

    setUploading(true);

    try {
      // Upload files to Supabase Storage
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('bank-statements')
          .upload(fileName, file);

        if (error) throw error;
        return data.path;
      });

      const uploadedPaths = await Promise.all(uploadPromises);

      // Process bank statements with AI
      const response = await fetch('/api/cash-flow/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePaths: uploadedPaths
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze bank statements');
      }

      const result = await response.json();

      toast.success(`Analyzed ${files.length} bank statement(s) successfully`);
      setFiles([]);
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload bank statements. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop bank statements here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">
              Drag & drop bank statements (CSV/Excel)
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button type="button" variant="secondary" size="sm">
              Browse Files
            </Button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">How to export bank statements:</p>
          <ul className="text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
            <li>Login to your net banking (HDFC, ICICI, Axis, SBI, etc.)</li>
            <li>Go to Statements → Download → Select date range (last 3 months recommended)</li>
            <li>Choose format: CSV or Excel</li>
            <li>Upload all bank accounts (one file per account)</li>
          </ul>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <File className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing bank statements...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Analyze {files.length} File{files.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
      )}
    </div>
  );
}

