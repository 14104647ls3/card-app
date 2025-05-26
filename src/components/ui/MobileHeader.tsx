import { Form } from '@/models/form';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
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

interface MobileHeaderProps {
  selectedForm: Form | null;
  responsesData: ResponsesData | null;
  onToggleSidebar: () => void;
}

export function MobileHeader({ selectedForm, responsesData, onToggleSidebar }: MobileHeaderProps) {
  return (
    <div className="sm:block md:block lg:block bg-white border-b border-soft-blue p-4">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
            <HamburgerMenuIcon
            onClick={onToggleSidebar}
            className="h-5 w-5 text-navy rounded-lg hover:bg-lightest-blue transition-colors"
            aria-label="Toggle forms sidebar"
          />

              </div>
              <div>
            <h1 className="text-lg font-bold text-navy">
              {selectedForm ? selectedForm.title : 'Form Responses'}
            </h1>
            {selectedForm && (
              <p className="text-xs text-gray-600">
                {responsesData?.quickStats.totalSubmissions || 0} responses
              </p>
            )}
          </div>

        {selectedForm && (
          <div className="text-right">
            <div className="text-lg font-bold text-ocean-blue">
              {responsesData?.quickStats.totalSubmissions || 0}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        )}
      </div>
    </div>
  );
} 