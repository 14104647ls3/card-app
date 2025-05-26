'use client';

import { useState } from 'react';
import { isMobileOrTabletUserAgent, MOBILE_USER_AGENTS } from '@/lib/userAgent';

export default function TestRedirectPage() {
  const [userAgent, setUserAgent] = useState('');
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const testUserAgent = () => {
    const result = isMobileOrTabletUserAgent(userAgent);
    setTestResult(result);
  };

  const setTestUserAgent = (ua: string) => {
    setUserAgent(ua);
    setTestResult(isMobileOrTabletUserAgent(ua));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mobile Redirect Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Browser</h2>
          <p className="text-sm text-gray-600 mb-2">Your current user agent:</p>
          <code className="block bg-gray-100 p-3 rounded text-sm break-all">
            {typeof window !== 'undefined' ? navigator.userAgent : 'Loading...'}
          </code>
          <p className="mt-2">
            <strong>Detection result:</strong> {' '}
            {typeof window !== 'undefined' 
              ? isMobileOrTabletUserAgent(navigator.userAgent) 
                ? '📱 Mobile/Tablet detected' 
                : '🖥️ Desktop detected'
              : 'Loading...'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test User Agent Detection</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter User Agent String:
            </label>
            <textarea
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-sm"
              rows={3}
              placeholder="Enter a user agent string to test..."
            />
          </div>
          
          <button
            onClick={testUserAgent}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Test Detection
          </button>
          
          {testResult !== null && (
            <div className={`p-3 rounded ${testResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Result: {testResult ? '📱 Mobile/Tablet detected' : '🖥️ Desktop detected'}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sample User Agents</h2>
          <div className="space-y-3">
            {Object.entries(MOBILE_USER_AGENTS).map(([device, ua]) => (
              <div key={device} className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-sm">{device}</strong>
                  <button
                    onClick={() => setTestUserAgent(ua)}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                  >
                    Test This
                  </button>
                </div>
                <code className="text-xs text-gray-600 break-all">{ua}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to Test the Redirect:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Open browser developer tools (F12)</li>
            <li>Go to the &quot;Network&quot; or &quot;Console&quot; tab</li>
            <li>Look for device emulation options</li>
            <li>Select a mobile device (iPhone, iPad, Android, etc.)</li>
            <li>Navigate to <code className="bg-blue-100 px-1 rounded">/responses</code></li>
            <li>You should be automatically redirected to <code className="bg-blue-100 px-1 rounded">/responses/mobile</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
} 