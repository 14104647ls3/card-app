'use client';
import React from 'react';
import { Form } from '../models/form';
import { Question } from './Question';

export default function FormRenderer({ form }: { form: Form }) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
      <p className="mb-4 text-gray-500">{form.description}</p>
      <form className="space-y-4">
        {form.questions.map((q) => (
          <Question key={q.id} question={q} />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow">Submit</button>
      </form>
    </div>
  );
}