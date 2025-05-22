import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
export const db = client.db('porject_form');
export const formsCollection = db.collection('forms');
export const responsesCollection = db.collection('responses');

// models/form.ts
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