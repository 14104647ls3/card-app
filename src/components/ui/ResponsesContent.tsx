import { Form } from '@/models/form';

interface QuickStats {
  totalSubmissions: number;
  numberOfQuestions: number;
}

interface QuestionAnswers {
  questionId: string;
  questionLabel: string;
  questionType: string;
  answers: Array<{
    responseId: string;
    questionType: string;
    value: unknown;
    submittedAt: Date;
  }>;
}

interface ResponsesData {
  quickStats: QuickStats;
  groupedAnswers: QuestionAnswers[];
  allResponses: unknown[];
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
              {responsesData?.quickStats.totalSubmissions || 0}
            </div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
        </div>
      </div>
        
      {/* Quick Stats - Removed "Answered Questions" section */}
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-3 sm:gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'} mb-6`}>
        <div className={`bg-white ${isMobile ? 'p-3 sm:p-4' : 'p-4'} rounded-lg border border-soft-blue`}>
          <div className={`${isMobile ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-navy`}>
            {responsesData?.quickStats.totalSubmissions || 0}
          </div>
          <div className={`${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-600`}>
            {isMobile ? 'Submissions' : 'Total Submissions'}
          </div>
        </div>
        <div className={`bg-white ${isMobile ? 'p-3 sm:p-4' : 'p-4'} rounded-lg border border-soft-blue`}>
          <div className={`${isMobile ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-navy`}>
            {responsesData?.quickStats.numberOfQuestions || selectedForm.questions.length}
          </div>
          <div className={`${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-600`}>Questions</div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className={`${isMobile ? 'space-y-4 sm:space-y-6' : 'space-y-6'}`}>
        <h2 className={`${isMobile ? 'text-xl sm:text-2xl' : 'text-2xl'} font-bold text-navy mb-4`}>
          Question Responses
        </h2>
        
        {responsesData?.groupedAnswers.map((questionData, index) => (
          <div key={questionData.questionId} className={`bg-white ${isMobile ? 'p-4 sm:p-6' : 'p-6'} rounded-lg border border-soft-blue`}>
            <div className="mb-4">
              <h3 className={`${isMobile ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-navy mb-2`}>
                {isMobile ? `Q${index + 1}:` : `Question ${index + 1}:`} {questionData.questionLabel}
              </h3>
              <div className={`flex ${isMobile ? 'flex-col sm:flex-row sm:items-center gap-2 sm:gap-4' : 'items-center gap-4'} ${isMobile ? 'text-xs sm:text-sm' : 'text-sm'} text-gray-600`}>
                <span>Type: {questionData.questionType}</span>
                <span className={`${isMobile ? 'hidden sm:inline' : ''}`}>•</span>
                <span>Total Answers: {questionData.answers.length}</span>
              </div>
            </div>
            
            {/* Display answers */}
            {questionData.answers.length > 0 ? (
              <div className={`bg-gray-50 ${isMobile ? 'p-3 sm:p-4' : 'p-4'} rounded-lg`}>
                <h4 className={`font-medium text-navy mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Responses ({questionData.answers.length})
                </h4>
                <div className={`space-y-2 max-h-64 overflow-y-auto`}>
                  {questionData.answers.slice(0, 10).map((answer, answerIndex) => (
                    <div key={answerIndex} className={`bg-white p-3 rounded border ${isMobile ? 'text-xs sm:text-sm' : 'text-sm'}`}>
                      <div className="font-medium text-gray-800">
                        {Array.isArray(answer.value) 
                          ? (answer.value as string[]).join(', ')
                          : String(answer.value)
                        }
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(answer.submittedAt).toLocaleDateString()} at {new Date(answer.submittedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {questionData.answers.length > 10 && (
                    <div className={`text-center text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} py-2`}>
                      ... and {questionData.answers.length - 10} more responses
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`bg-gray-50 ${isMobile ? 'p-3 sm:p-4' : 'p-4'} rounded-lg border-2 border-dashed border-gray-300`}>
                <div className="text-center text-gray-500">
                  <div className={`${isMobile ? 'w-8 h-8 sm:w-12 sm:h-12' : 'w-12 h-12'} bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-4 w-4 sm:h-6 sm:w-6' : 'h-6 w-6'} text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className={`font-medium ${isMobile ? 'text-xs sm:text-sm' : 'text-sm'}`}>
                    No responses yet
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {responsesData?.groupedAnswers.length === 0 && (
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