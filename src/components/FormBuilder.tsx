// components/FormBuilder.tsx
'use client';
import { useState } from 'react';
import { Form, Question } from '../models/form';
import QuestionEditor from './QuestionEditor';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FormBuilder({ initialForm }: { initialForm: Form }) {
    const [form, setForm] = useState<Form>(initialForm);
    const [saving, setSaving] = useState(false);
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
            setSaving(true);
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
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-lightest-blue to-white py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="form-container mb-8">
                    <div className="form-header">
                        <input
                            className="text-2xl md:text-3xl font-bold w-full bg-transparent border-0 focus:ring-2 focus:ring-white focus:outline-none text-white placeholder-soft-blue"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Form Title"
                        />
                        <textarea
                            className="w-full mt-3 bg-transparent border-0 focus:ring-2 focus:ring-white focus:outline-none text-soft-blue placeholder-soft-blue resize-none"
                            value={form.description || ''}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Form Description"
                            rows={2}
                        />
                    </div>
                    
                    <div className="form-body">
                        {form.questions.length > 0 ? (
                            <div className="space-y-6 mb-6">
                                {form.questions.map((q, index) => (
                                    <div key={q.id} className="question-card rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center bg-pale-blue px-4 py-2 rounded-t-lg">
                                            <div className="text-navy font-medium">Question {index + 1}</div>
                                            <button 
                                                onClick={() => removeQuestion(q.id)}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="Remove question"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <QuestionEditor key={q.id} question={q} onChange={(updated) => updateQuestion(q.id, updated)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-white rounded-lg border border-dashed border-pale-blue">
                                <p className="text-gray-500 mb-4">Your form has no questions yet</p>
                                <button 
                                    onClick={addQuestion}
                                    className="text-ocean-blue hover:text-deep-blue font-medium"
                                >
                                    Add your first question
                                </button>
                            </div>
                        )}
                        
                        <div className="flex justify-center mt-6">
                            <button 
                                onClick={addQuestion} 
                                className="flex items-center gap-2 bg-sky-blue hover:bg-light-blue text-navy px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Question
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                        onClick={() => router.push('/')} 
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </button>

                    <button 
                        onClick={saveForm} 
                        disabled={saving}
                        className={`btn-primary flex items-center justify-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                                </svg>
                                Save Form
                            </>
                        )}
                    </button>
                    
                    <Link 
                        href={`/form/${form._id}`} 
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Preview
                    </Link>
                    

                </div>
            </div>
        </div>
    );
}