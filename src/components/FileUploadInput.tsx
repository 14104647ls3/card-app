'use client';
import React, { useState, useRef, useCallback } from 'react';

interface FileUploadInputProps {
  questionId: string;
  formId?: string;
  isRequired?: boolean;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  mimeType: string;
}

export default function FileUploadInput({
  questionId,
  formId,
  isRequired = false,
  acceptedFileTypes,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}: FileUploadInputProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size must be less than ${formatFileSize(maxFileSize)}`;
    }

    // Check file type if restrictions exist
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = acceptedFileTypes.some(type => 
        type.toLowerCase() === fileExtension || 
        file.type.startsWith(type.replace('*', ''))
      );
      
      if (!isValidType) {
        return `Only ${acceptedFileTypes.join(', ')} files are allowed`;
      }
    }

    return null;
  };

  // Upload file to server
  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    if (!formId) {
      setError('Form ID is required for file upload');
      return null;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('formId', formId);
    formData.append('questionId', questionId);

    try {
      const response = await fetch('/api/forms/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      return {
        fileId: result.fileId,
        filename: result.filename,
        size: result.size,
        mimeType: result.mimeType,
      };
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      return null;
    }
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList) => {
    setError(null);
    setUploading(true);

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        newFiles.push(uploadedFile);
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setUploading(false);

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [formId, questionId, maxFileSize, acceptedFileTypes]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Remove uploaded file
  const removeFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/forms/upload/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(file => file.fileId !== fileId));
      } else {
        setError('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete file');
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden input for storing file IDs - accessible with screen reader label */}
      <label htmlFor={`file-ids-${questionId}`} className="sr-only">
        File IDs for question {questionId}
      </label>
      <input
        id={`file-ids-${questionId}`}
        type="hidden"
        name={questionId}
        value={uploadedFiles.map(f => f.fileId).join(',')}
        required={isRequired && uploadedFiles.length === 0}
      />
      
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-sky-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept={acceptedFileTypes?.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          aria-label="Select files to upload"
        />
        
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-sky-blue">Click to upload</span> or drag and drop
            </p>
            {acceptedFileTypes && (
              <p className="text-xs text-gray-500 mt-1">
                Supported: {acceptedFileTypes.join(', ')}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Max size: {formatFileSize(maxFileSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="text-sm text-gray-600 bg-gray-50 border rounded p-2">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-sky-blue border-t-transparent rounded-full"></div>
            Uploading files...
          </div>
        </div>
      )}

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.fileId}
              className="flex items-center justify-between bg-gray-50 border rounded p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-blue rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeFile(file.fileId)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                title="Remove file"
                aria-label={`Remove file ${file.filename}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 