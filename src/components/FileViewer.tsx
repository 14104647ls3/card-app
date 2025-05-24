'use client';
import React, { useState, useEffect } from 'react';

interface FileInfo {
  _id: string;
  filename: string;
  originalName: string;
  mimeType?: string;
  size: number;
  uploadedAt: string;
}

interface FileViewerProps {
  formId: string;
  questionId: string;
  questionLabel: string;
}

export default function FileViewer({ formId, questionId, questionLabel }: FileViewerProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Fetch files for this question
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/forms/${formId}/files/${questionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  // Download file
  const downloadFile = (fileId: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `/api/forms/upload/${fileId}`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get file type icon
  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return '📄';
    
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📋';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
    
    return '📄';
  };

  useEffect(() => {
    fetchFiles();
  }, [formId, questionId]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {questionLabel} - Uploaded Files
        </h3>
        <button
          onClick={fetchFiles}
          className="text-sm text-sky-blue hover:text-deep-blue font-medium"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-4">
          {error}
        </div>
      )}

      {loading && files.length === 0 ? (
        <div className="text-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-sky-blue border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mx-auto w-12 h-12 text-gray-300 mb-3">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p>No files uploaded for this question yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-3">
            {files.length} file{files.length !== 1 ? 's' : ''} uploaded
          </p>
          
          {files.map((file) => (
            <div
              key={file._id}
              className="flex items-center justify-between bg-gray-50 border rounded-lg p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-2xl">
                  {getFileIcon(file.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => downloadFile(file._id, file.originalName)}
                className="flex items-center gap-1 text-sm text-sky-blue hover:text-deep-blue font-medium px-3 py-1 rounded hover:bg-sky-50 transition-colors"
                title="Download file"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 