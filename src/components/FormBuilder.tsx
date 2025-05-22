// components/FormBuilder.tsx
'use client';
import { useState } from 'react';
import { Form, Question } from '../models/form';
import QuestionEditor from './QuestionEditor';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function FormBuilder({ initialForm }: { initialForm: Form }) {
    const [form, setForm] = useState<Form>(initialForm);
    const router = useRouter();

    const addQuestion = () => {
        const newQuestion: Question = {
            id: uuidv4(),
            type: 'short',
            label: 'Untitled Question',
            isRequired: false,
        };
        setForm({ ...form, questions: [...form.questions, newQuestion] });
    };

    const removeQuestion = (id: string) => {
        const updatedQuestions = form.questions.filter((q) => q.id !== id);
        setForm({ ...form, questions: updatedQuestions });
    };
    const updateQuestion = (id: string, updated: Question) => {
        const updatedQuestions = form.questions.map((q) => (q.id === id ? updated : q));
        setForm({ ...form, questions: updatedQuestions });
    };

    const saveForm = async () => {
        try {
            const res = await fetch(`/api/forms/${form._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to save form');
            }
            alert('Form saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Error saving form.');
        }
    };


    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <input
                className="text-2xl font-bold w-full border-b p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
                className="w-full border p-2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {form.questions.map((q) => (
                <>
                    <button onClick={() => removeQuestion(q.id)}>Remove Question</button>
                    <QuestionEditor key={q.id} question={q} onChange={(updated) => updateQuestion(q.id, updated)} />
                </>
            ))}
            <button onClick={addQuestion} className="bg-green-200 px-3 py-1 rounded">Add Question</button>
            <button onClick={saveForm} className="bg-blue-600 text-white px-4 py-2 rounded shadow">Save Form</button>
            <button onClick={() => router.push('/')} className="bg-gray-200 px-3 py-1 rounded">Back to Home</button>
        </div>
    );
}