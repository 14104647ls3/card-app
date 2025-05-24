// app/page.tsx (Main Page)
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Form } from '../models/form';
import { CardPopover } from '@/components/ui/CardPopover';


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
    <main className="min-h-screen bg-neutral-400 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">My Forms</h1>
          <p className="text-ocean-blue text-lg">Create, manage, and share your forms</p>
        </header>
        
        <div className="flex justify-center mb-8">
          <button
            onClick={createNewForm}
            className="btn-primary px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Form
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div 
                key={form._id} 
                className="bg-stone-200 rounded-lg shadow-md hover:shadow-2xl transition border-none overflow-hidden flex flex-col"
              >
                <div className="p-4 flex-grow">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-navy mb-2 line-clamp-1">{form.title}</h2>
                    <CardPopover formId={form._id} onFormCloned={fetchForms} />
                  </div>
                  {form.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{form.description}</p>
                  )}
                </div>
                
                <div className="border-t border-pale-blue p-3 bg-lightest-blue flex justify-between">
                  <div className="flex gap-3">
                    <Link 
                      href={`/form/${form._id}`} 
                      className="btn-primary text-ocean-blue hover:text-deep-blue font-medium text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor" style={{ transform: 'rotate(90deg)' }}>
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      Survey
                    </Link>
                    <Link 
                      href={`/form/${form._id}/edit`} 
                      className="btn-secondary text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </Link>
                  </div>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="btn-danger font-medium text-sm flex items-center"
                    aria-label="Delete form"
                    title="Delete this form"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}