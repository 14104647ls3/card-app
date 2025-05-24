'use client';
import React, { useState, useEffect } from 'react';
import { Form } from '../models/form';
import { Question } from './Question';
import Link from 'next/link';

export default function FormRenderer({ form }: { form: Form }) {
    const [submitted, setSubmitted] = useState(false);
    const [hasFormData, setHasFormData] = useState(false);

    // Track form changes to determine if user should be warned about leaving
    const handleFormChange = () => {
        setHasFormData(true);
    };

    // Add beforeunload event listener to warn user about leaving
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasFormData && !submitted) {
                const message = 'You have unsaved changes. Are you sure you want to leave?';
                e.preventDefault();
                e.returnValue = message; // For older browsers
                return message; // For modern browsers
            }
        };

        // Add event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasFormData, submitted]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObject = Object.fromEntries(formData);
        const payload = JSON.stringify(formDataObject);
        console.log(payload);

        try {
            const res = await fetch(`/api/forms/${form._id}/submit`, {
                method: 'POST',
                body: payload,
            });
            
            if (res.ok) {
                setSubmitted(true);
                setHasFormData(false); // Reset form data state after successful submission
            } else {
                alert('Error submitting form.');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert('Error submitting form. Please try again.');
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lightest-blue to-white p-4">
                <div className="form-container max-w-2xl w-full bg-white text-center p-8">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-navy mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-6">Your response has been recorded.</p>
                    <Link href="/" className="btn-primary inline-block">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-lightest-blue to-white py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="form-container mb-8">
                    <div className="form-header">
                        <h1 className="text-2xl md:text-3xl font-bold">{form.title}</h1>
                        {form.description && (
                            <p className="mt-2 text-soft-blue">{form.description}</p>
                        )}
                    </div>
                    
                    <div className="form-body">
                        <form className="space-y-6" onSubmit={submitForm} onChange={handleFormChange}>
                            {form.questions.map((q) => (
                                <div key={q.id} className="question-card">
                                    <Question question={q} />
                                </div>
                            ))}
                            
                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <button 
                                    type="submit" 
                                    className="btn-primary order-1 sm:order-1"
                                >
                                    Submit
                                </button>
                                <Link 
                                    href="/" 
                                    className="btn-secondary order-2 sm:order-2 text-center"
                                    onClick={(e) => {
                                        if (hasFormData && !submitted) {
                                            const confirmed = confirm('You have unsaved changes. Are you sure you want to leave?');
                                            if (!confirmed) {
                                                e.preventDefault();
                                            }
                                        }
                                    }}
                                >
                                    Back
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}