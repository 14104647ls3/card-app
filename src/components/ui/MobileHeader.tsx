import { Form } from '@/models/form';
import { AppIcon } from './AppIcon';

interface ResponsesData {
  formId: string;
  formTitle: string;
  totalResponses: number;
  questionStatistics: unknown[];
  responses: unknown[];
}

interface MobileHeaderProps {
  selectedForm: Form | null;
  responsesData: ResponsesData | null;
  onToggleSidebar: () => void;
}

export function MobileHeader({ selectedForm, responsesData, onToggleSidebar }: MobileHeaderProps) {
  return (
    <div className="sm:block md:block lg:hidden bg-white border-b border-soft-blue p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg border border-soft-blue hover:bg-lightest-blue transition-colors"
            aria-label="Toggle forms sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm10-4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </button>
          <AppIcon size="sm" />
          <div>
            <h1 className="text-lg font-bold text-navy">
              {selectedForm ? selectedForm.title : 'Form Responses'}
            </h1>
            {selectedForm && (
              <p className="text-xs text-gray-600">
                {responsesData?.totalResponses || 0} responses
              </p>
            )}
          </div>
        </div>
        {selectedForm && (
          <div className="text-right">
            <div className="text-lg font-bold text-ocean-blue">
              {responsesData?.totalResponses || 0}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        )}
      </div>
    </div>
  );
} 