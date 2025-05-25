'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export function MobileTopBar() {
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
    <header className="bg-white border-b border-soft-blue shadow-sm sticky top-0 z-50 block md:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

          {/* Right side - Hamburger Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="inline-flex size-[40px] items-center justify-center rounded-lg hover:bg-lightest-blue hover:text-ocean-blue transition-all duration-200"
                aria-label="Open menu"
              >
                <HamburgerMenuIcon className="h-5 w-5" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] rounded-lg bg-white p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                sideOffset={8}
                align="end"
              >
                {/* Navigation Items */}
                <DropdownMenu.Item asChild>
                  <Link
                    href="/"
                    className={`group relative flex h-[40px] select-none items-center rounded-md px-3 text-[14px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-lightest-blue data-[disabled]:text-gray-400 data-[highlighted]:text-ocean-blue font-medium ${
                      pathname === '/' ? 'bg-ocean-blue text-white' : 'text-gray-700'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-3" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Forms
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link
                    href="/responses"
                    className={`group relative flex h-[40px] select-none items-center rounded-md px-3 text-[14px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-lightest-blue data-[disabled]:text-gray-400 data-[highlighted]:text-ocean-blue font-medium ${
                      pathname === '/responses' ? 'bg-ocean-blue text-white' : 'text-gray-700'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-3" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Responses
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-[1px] bg-soft-blue my-1" />

                {/* Create New Form Button */}
                <DropdownMenu.Item asChild>
                  <button
                    onClick={createNewForm}
                    className="group relative flex h-[40px] w-full select-none items-center rounded-md px-3 text-[14px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-ocean-blue data-[disabled]:text-gray-400 data-[highlighted]:text-white font-medium text-ocean-blue bg-lightest-blue"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-3" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Form
                  </button>
                </DropdownMenu.Item>

                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
} 