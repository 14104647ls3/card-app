// app/page.tsx (Main Page)
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Form } from '../models/form';

export default function HomePage() {
  const [forms, setForms] = useState<Form[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/forms')
      .then(res => res.json())
      .then(data => setForms(data));
  }, []);

  const createNewForm = async () => {
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Untitled Form',
        description: '',
        questions: []
      })
    });
    const newForm = await res.json();
    router.push(`/form/${newForm._id}/edit`);
  };

  const deleteForm = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this form?');
    if (!confirmed) return;

    const res = await fetch(`/api/forms/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setForms(forms.filter(form => form._id !== id));
    } else {
      alert('Failed to delete form');
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Forms</h1>
        <button
          onClick={createNewForm}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + New Form
        </button>
      </div>
      <ul className="space-y-4">
        {forms.map((form: Form) => (
          <li key={form._id} className="border p-4 rounded hover:shadow">
            <h2 className="text-xl font-semibold">{form.title}</h2>
            <p className="text-gray-600">{form.description}</p>
            <div className="mt-2 flex gap-4">
              <Link href={`/form/${form._id}`} className="text-blue-600">Fill Form</Link>
              <Link href={`/form/${form._id}/edit`} className="text-gray-600">Edit</Link>
              <button
                onClick={() => deleteForm(form._id)}
                className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}