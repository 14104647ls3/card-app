'use client';

import { useState } from 'react';
import { FormsSidebar } from '@/components/ui/FormsSidebar';
import { ResponsesContent } from '@/components/ui/ResponsesContent';
import { EmptyState, LoadingState, ErrorState } from '@/components/ui/ResponsesStateViews';
import { MobileHeader } from '@/components/ui/MobileHeader';
import { useResponses } from '@/hooks/useResponses';
import { Form } from '@/models/form';

export default function MobileResponsesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    forms,
    selectedForm,
    responsesData,
    loading,
    error,
    handleFormSelect,
    retryFetch
  } = useResponses();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFormSelectWithClose = (form: Form) => {
    handleFormSelect(form);
    setSidebarOpen(false);
  };

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="relative h-screen">
        
        {/* Mobile Header with Sidebar Toggle */}
        <MobileHeader
          selectedForm={selectedForm}
          responsesData={responsesData}
          onToggleSidebar={toggleSidebar}
        />

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 sm:block md:block lg:block">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 transition-all duration-300 ease-in-out"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
              <FormsSidebar
                forms={forms}
                selectedForm={selectedForm}
                onFormSelect={handleFormSelectWithClose}
                onClose={() => setSidebarOpen(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="h-full overflow-y-auto">
          {!selectedForm ? (
            <EmptyState onToggleSidebar={toggleSidebar} isMobile={true} />
          ) : loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={retryFetch} isMobile={true} />
          ) : responsesData ? (
            <ResponsesContent
              selectedForm={selectedForm}
              responsesData={responsesData}
              isMobile={true}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
