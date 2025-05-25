'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <header className="bg-white border-b border-soft-blue shadow-sm sticky top-0 z-50 hidden md:block font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and System Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-ocean-blue rounded-lg flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-navy">Formify</h1>
          </div>

          {/* Center - Navigation Buttons */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                pathname === '/' 
                  ? 'bg-ocean-blue text-white' 
                  : 'text-gray-600 hover:text-ocean-blue hover:bg-lightest-blue'
              }`}
            >
              Forms
            </Link>
            <Link
              href="/responses"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                pathname === '/responses' 
                  ? 'bg-ocean-blue text-white' 
                  : 'text-gray-600 hover:text-ocean-blue hover:bg-lightest-blue'
              }`}
            >
              Responses
            </Link>
          </nav>

          {/* Right side - Create New Form Button */}
          <button
            onClick={createNewForm}
            className="btn-primary px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2 font-medium"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Form
          </button>
        </div>
      </div>
    </header>
  );
} 