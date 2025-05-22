import React from 'react';
import { Question } from '@/models/form';

export function Question({ question }: { question: Question }) {
  switch (question.type) {
    case 'short':
          return (
              <div>
                  <label className="font-semibold">{question.label}</label>
                  <input name={question.id} type="text" className="w-full border p-2 rounded" placeholder="Enter your answer here"/>
                </div>
            )
    case 'paragraph':
          return (
              <div>
                  <label className="font-semibold">{question.label}</label>
                  <textarea name={question.id} className="w-full border p-2 rounded" placeholder="Enter your answer here"/>
              </div>
          )
    case 'radio':
      return (
        <div>
          <label className="font-semibold">{question.label}</label>
          {question.options?.map((opt) => (
            <div key={opt}><input type="radio" name={question.id} value={opt} /> {opt}</div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div>
          <label className="font-semibold">{question.label}</label>
          {question.options?.map((opt) => (
            <div key={opt}><input name={question.id} type="checkbox" value={opt} /> {opt}</div>
          ))}
        </div>
      );
    default:
      return null;
  }
}