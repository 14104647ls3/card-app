export interface FileUpload {
  fileId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface ResponseAnswer {
  questionId: string;
  value: string | string[] | FileUpload[]; // Support for different question types
}

export interface FormResponse {
  _id?: string;
  formId: string;
  answers: ResponseAnswer[];
  submittedAt: Date;
  submitterInfo?: {
    ip?: string;
    userAgent?: string;
  };
}
