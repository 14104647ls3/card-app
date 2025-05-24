import React from 'react';
import { Question as QuestionType } from '@/models/form';
import FileUploadInput from '@/components/FileUploadInput';

export function Question({ question, formId }: { question: QuestionType; formId?: string }) {
  // Helper function to render required asterisk
  const requiredMark = question.isRequired ? (
    <span className="text-red-500 ml-1">*</span>
  ) : null;

  const labelElement = (
    <label className="block font-medium text-navy mb-2">
      {question.label}
      {requiredMark}
    </label>
  );

  switch (question.type) {
    case 'short':
      return (
        <div className="mb-1">
          {labelElement}
          <input 
            name={question.id} 
            type="text" 
            className="w-full border border-pale-blue rounded-md p-3 focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all" 
            placeholder="Your answer"
            required={question.isRequired}
          />
        </div>
      );
    case 'paragraph':
      return (
        <div className="mb-1">
          {labelElement}
          <textarea 
            name={question.id} 
            className="w-full border border-pale-blue rounded-md p-3 focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all min-h-[100px]" 
            placeholder="Your answer"
            required={question.isRequired}
          />
        </div>
      );
    case 'radio':
      return (
        <div className="mb-1">
          {labelElement}
          <div className="space-y-2 mt-2">
            {question.options?.map((opt) => (
              <div key={opt} className="flex items-center">
                <input 
                  type="radio" 
                  id={`${question.id}-${opt}`}
                  name={question.id} 
                  value={opt}
                  required={question.isRequired}
                  className="h-4 w-4 text-ocean-blue focus:ring-sky-blue" 
                />
                <label htmlFor={`${question.id}-${opt}`} className="ml-2 text-gray-700">
                  {opt}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case 'checkbox':
      return (
        <div className="mb-1">
          {labelElement}
          <div className="space-y-2 mt-2">
            {question.options?.map((opt) => (
              <div key={opt} className="flex items-center">
                <input 
                  type="checkbox"
                  id={`${question.id}-${opt}`}
                  name={question.id} 
                  value={opt}
                  className="h-4 w-4 text-ocean-blue focus:ring-sky-blue rounded" 
                />
                <label htmlFor={`${question.id}-${opt}`} className="ml-2 text-gray-700">
                  {opt}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case 'file':
      return (
        <div className="mb-1">
          {labelElement}
          <FileUploadInput
            questionId={question.id}
            formId={formId}
            isRequired={question.isRequired}
            acceptedFileTypes={question.acceptedFileTypes}
            maxFileSize={question.maxFileSize}
          />
        </div>
      );
    default:
      return null;
  }
}