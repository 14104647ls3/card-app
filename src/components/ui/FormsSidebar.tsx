import { Form } from '@/models/form';

interface FormsSidebarProps {
  forms: Form[];
  selectedForm: Form | null;
  onFormSelect: (form: Form) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FormsSidebar({ 
  forms, 
  selectedForm, 
  onFormSelect, 
  onClose,
  isMobile = false 
}: FormsSidebarProps) {
  const handleFormSelect = (form: Form) => {
    onFormSelect(form);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full bg-white shadow-sm overflow-y-auto">
      <div className="p-6 border-b border-soft-blue">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-navy">Forms</h2>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm">Select a form to view responses</p>
      </div>
      
      <div className="p-4">
        {forms.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-lightest-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-blue" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No forms available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {forms.map((form) => (
              <button
                key={form._id}
                onClick={() => handleFormSelect(form)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedForm?._id === form._id
                    ? 'bg-ocean-blue text-white border-ocean-blue shadow-md'
                    : 'bg-white border-soft-blue hover:border-ocean-blue hover:bg-lightest-blue'
                }`}
              >
                <h3 className={`font-semibold mb-1 line-clamp-1 ${
                  selectedForm?._id === form._id ? 'text-white' : 'text-navy'
                }`}>
                  {form.title}
                </h3>
                {form.description && (
                  <p className={`text-sm line-clamp-2 ${
                    selectedForm?._id === form._id ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {form.description}
                  </p>
                )}
                <div className={`text-xs mt-2 ${
                  selectedForm?._id === form._id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 