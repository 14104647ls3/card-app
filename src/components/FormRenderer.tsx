'use client';
import React from 'react';
import { Form } from '../models/form';
import { Question } from './Question';
import Link from 'next/link';

export default function FormRenderer({ form }: { form: Form }) {
    // submit form to api/forms/[id]/submit




    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObject = Object.fromEntries(formData);
        // console.log(formDataObject);
        const payload = JSON.stringify(formDataObject);
        console.log(payload);

        const res = await fetch(`/api/forms/${form._id}/submit`, {
            method: 'POST',
            body: payload,
        });
        if (res.ok) {
            alert('Form submitted successfully!');
        } else {
            alert('Error submitting form.');
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
            <p className="mb-4 text-gray-600">{form.description}</p>
            <form className="question-form space-y-4" onSubmit={submitForm}>
                <ul className="space-y-4">
                    {form.questions.map((q) => (
                        <Question key={q.id} question={q} />
                    ))}
                </ul>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow mr-2">Submit</button>
            </form>
            <br />
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded shadow">Cancel</Link>
        </div>
    );
}