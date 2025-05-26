'use client';

import { FormsSidebar } from '@/components/ui/FormsSidebar';
import { ResponsesContent } from '@/components/ui/ResponsesContent';
import { EmptyState, LoadingState, ErrorState } from '@/components/ui/ResponsesStateViews';
import { useResponses } from '@/hooks/useResponses';

export default function ResponsesPage() {
  const {
    forms,
    selectedForm,
    responsesData,
    loading,
    error,
    handleFormSelect,
    retryFetch
  } = useResponses();

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="flex h-screen">
        
        {/* Sidebar - Forms List */}
        <div className="w-80 bg-white border-r border-soft-blue shadow-sm overflow-y-auto">
          <FormsSidebar
            forms={forms}
            selectedForm={selectedForm}
            onFormSelect={handleFormSelect}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {!selectedForm ? (
            <EmptyState />
          ) : loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={retryFetch} />
          ) : responsesData ? (
            <ResponsesContent
              selectedForm={selectedForm}
              responsesData={responsesData}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
} 