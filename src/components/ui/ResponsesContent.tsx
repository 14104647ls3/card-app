import { Form } from '@/models/form';
import { ResponseDoughnut } from './ResponseChart';

interface QuestionStatistics {
  questionId: string;
  questionLabel: string;
  questionType: string;
  totalAnswers: number;
  statistics?: {
    [option: string]: {
      count: number;
      percentage: number;
    };
  };
}

interface ResponsesData {
  formId: string;
  formTitle: string;
  totalResponses: number;
  questionStatistics: QuestionStatistics[];
  responses: unknown[];
}

interface ResponsesContentProps {
  selectedForm: Form;
  responsesData: ResponsesData;
  isMobile?: boolean;
}

export function ResponsesContent({ 
  selectedForm, 
  responsesData, 
  isMobile = false 
}: ResponsesContentProps) {
  return (
    <div className={`${isMobile ? 'p-4 sm:p-6' : 'p-6'}`}>
      {/* Header - Hidden on mobile since it's in the top bar */}
      <div className={`${isMobile ? 'hidden lg:block' : ''} mb-8`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">{selectedForm.title}</h1>
            {selectedForm.description && (
              <p className="text-gray-600">{selectedForm.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-ocean-blue">
              {responsesData?.totalResponses || 0}
            </div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
        </div>
      </div>
        
      {/* Quick Stats */}
      <div className={`grid ${isMobile ? 'grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4' : 'grid-cols-1 md:grid-cols-3 gap-4'} mb-6`}>
        <div className={`bg-white ${isMobile ? 'p-3 sm:p-4' : 'p-4'} rounded-lg border border-soft-blue`}>
          <div className={`${isMobile ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-navy`}>
            {responsesData?.totalResponses || 0}
          </div>
          <div className={`${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-600`}>
            {isMobile ? 'Submissions' : 'Total Submissions'}
          </div>
        </div>
        <div className={`bg-white ${isMobile ? 'p-3 sm:p-4' : 'p-4'} rounded-lg border border-soft-blue`}>
          <div className={`${isMobile ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-navy`}>
            {selectedForm.questions.length}
          </div>
          <div className={`${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-600`}>Questions</div>
        </div>
        <div className={`bg-white ${isMobile ? 'p-3 sm:p-4 col-span-2 sm:col-span-1' : 'p-4'} rounded-lg border border-soft-blue`}>
          <div className={`${isMobile ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-navy`}>
            {responsesData?.questionStatistics.filter(q => q.totalAnswers > 0).length || 0}
          </div>
          <div className={`${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-600`}>
            {isMobile ? 'Answered' : 'Answered Questions'}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className={`${isMobile ? 'space-y-4 sm:space-y-6' : 'space-y-6'}`}>
        <h2 className={`${isMobile ? 'text-xl sm:text-2xl' : 'text-2xl'} font-bold text-navy mb-4`}>
          Question Statistics
        </h2>
        
        {responsesData?.questionStatistics.map((questionStat, index) => (
          <div key={questionStat.questionId} className={`bg-white ${isMobile ? 'p-4 sm:p-6' : 'p-6'} rounded-lg border border-soft-blue`}>
            <div className="mb-4">
              <h3 className={`${isMobile ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-navy mb-2`}>
                {isMobile ? `Q${index + 1}:` : `Question ${index + 1}:`} {questionStat.questionLabel}
              </h3>
              <div className={`flex ${isMobile ? 'flex-col sm:flex-row sm:items-center gap-2 sm:gap-4' : 'items-center gap-4'} ${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-600`}>
                <span>Type: {questionStat.questionType}</span>
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>•</span>
                <span>Total Answers: {questionStat.totalAnswers}</span>
              </div>
            </div>
            
            {/* Statistics Placeholder */}
            <div className={`bg-gray-50 ${isMobile ? 'p-3 sm:p-4' : 'p-4'} rounded-lg border-2 border-dashed border-gray-300`}>
              <div className="text-center text-gray-500">
                <div className={`${isMobile ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-16 h-16'} bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-6 w-6 sm:h-8 sm:w-8' : 'h-8 w-8'} text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <p className={`font-medium ${isMobile ? 'text-sm sm:text-base' : 'text-base'}`}>
                  Statistics Component Placeholder
                </p>
                <p className={`${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} mt-1`}>
                </p>
                  {questionStat.questionType === 'radio' || questionStat.questionType === 'checkbox' 
                    ? (<>
                      Chart and percentage distribution will be displayed here
                      <ResponseDoughnut props={questionStat.statistics} />
                      </>)
                    : ('Answer summary will be displayed here')
                  }
                
              </div>
            </div>
          </div>
        ))}
        
        {responsesData?.questionStatistics.length === 0 && (
          <div className={`text-center ${isMobile ? 'py-8 sm:py-12' : 'py-12'}`}>
            <div className={`${isMobile ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-16 h-16'} bg-lightest-blue rounded-full flex items-center justify-center mx-auto mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-6 w-6 sm:h-8 sm:w-8' : 'h-8 w-8'} text-ocean-blue`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
              No responses available for this form yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 