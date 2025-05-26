// app/page.tsx (Main Page)
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Form } from '../models/form';
import { useDebouncedCallback } from 'use-debounce';
import CardCommon from '@/components/ui/CardCommon';

export default function HomePage() {
  const [forms, setForms] = useState<Form[]>([]);
  const router = useRouter();

  const fetchForms = () => {
    fetch('/api/forms')
      .then(res => res.json())
      .then(data => setForms(data));
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const createNewForm = useDebouncedCallback(async () => {
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
  }, 500);

  const deleteForm = useDebouncedCallback(async (id: string) => {
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
  }, 250);

  return (
    <main className="min-h-screen bg-neutral-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">My Forms</h1>
          <p className="text-ocean-blue text-lg">Create, manage, and share your forms</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {forms.length === 0 ? (
            <div className="col-span-full text-center p-10 rounded-lg bg-white shadow-sm border border-soft-blue">
              <p className="text-gray-600 mb-4">You don&apos;t have any forms yet</p>
              <button
                onClick={createNewForm}
                className="text-ocean-blue hover:text-deep-blue font-medium"
              >
                Create your first form
              </button>
            </div>
          ) : (
              forms.map((form: Form) => (
                <CardCommon key={form._id} form={form} fetchForms={fetchForms} deleteForm={deleteForm} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}