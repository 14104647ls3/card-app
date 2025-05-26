interface EmptyStateProps {
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  isMobile?: boolean;
}

export function EmptyState({ onToggleSidebar, isMobile = false }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center">
        <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} bg-lightest-blue rounded-full flex items-center justify-center mx-auto mb-6`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-ocean-blue`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45.5a2.5 2.5 0 10-3.9 0 .5.5 0 00.95.3 1.5 1.5 0 001.9 0 .5.5 0 00.95-.3z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-navy mb-2">Select a Form</h3>
        <p className="text-gray-600 mb-4">
          {isMobile 
            ? 'Tap the menu button to choose a form and view its responses'
            : 'Choose a form from the sidebar to view its responses and analytics'
          }
        </p>
        {isMobile && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn-primary px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Browse Forms
          </button>
        )}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-ocean-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading responses...</p>
      </div>
    </div>
  );
}

export function ErrorState({ error, onRetry, isMobile = false }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center">
        <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-red-500`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-red-600 mb-2`}>
          Error Loading Responses
        </h3>
        <p className={`text-gray-600 mb-4 ${isMobile ? 'text-sm' : ''}`}>{error}</p>
        <button
          onClick={onRetry}
          className="btn-primary px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
} 