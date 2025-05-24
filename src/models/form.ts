export type QuestionType = 'short' | 'paragraph' | 'radio' | 'checkbox' | 'file';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
  isRequired: boolean;
  // Additional properties for file upload questions
  acceptedFileTypes?: string[]; // e.g., ['.pdf', '.doc', '.jpg']
  maxFileSize?: number; // in bytes
}

export interface Form {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
}