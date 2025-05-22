import React from 'react';
import { Question } from '../models/form';

export function Question({ question }: { question: Question }) {
  switch (question.type) {
    case 'short':
      return <input type="text" className="w-full border p-2 rounded" placeholder={question.label} />;
    case 'paragraph':
      return <textarea className="w-full border p-2 rounded" placeholder={question.label} />;
    case 'radio':
      return (
        <div>
          <label className="font-semibold">{question.label}</label>
          {question.options?.map((opt) => (
            <div key={opt}><input type="radio" name={question.id} /> {opt}</div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div>
          <label className="font-semibold">{question.label}</label>
          {question.options?.map((opt) => (
            <div key={opt}><input type="checkbox" /> {opt}</div>
          ))}
        </div>
      );
    default:
      return null;
  }
}