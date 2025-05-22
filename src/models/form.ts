export type QuestionType = 'short' | 'paragraph' | 'radio' | 'checkbox';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
  isRequired: boolean;
}

export interface Form {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
}