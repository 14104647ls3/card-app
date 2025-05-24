'use client';
import React, { useState } from 'react';
import { Form } from '@/models/form';

interface AIFormGeneratorProps {
  onFormGenerated: (form: Omit<Form, '_id'>) => void;
  isGenerating?: boolean;
}

export default function AIFormGenerator({ onFormGenerated, isGenerating = false }: AIFormGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your form');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/forms/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate form');
      }

      const data = await response.json();
      
      if (data.success && data.form) {
        onFormGenerated(data.form);
        setPrompt(''); // Clear the prompt after successful generation
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Form generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate form');
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  const examplePrompts = [
    "Create a customer feedback survey for a restaurant",
    "Generate a job application form for a software developer position",
    "Make a course evaluation form for students",
    "Create a event registration form with file upload for documents",
    "Generate a product feedback form with ratings and comments"
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-dashed border-purple-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI Form Generator
        </h3>
        <p className="text-sm text-gray-600">
          Describe your form and let AI create it for you
        </p>
      </div>

      <div className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your form
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="e.g., Create a customer satisfaction survey for a coffee shop with rating questions and a comment section..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            disabled={generating || isGenerating}
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Ctrl+Enter to generate • Be specific about question types and requirements
          </p>
        </div>

        {/* Example Prompts */}
        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Example prompts:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={generating || isGenerating}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating || isGenerating}
          className="w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating || isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Generating Form...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Form with AI
            </div>
          )}
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Tips for better results:</p>
              <ul className="space-y-1 text-blue-600">
                <li>• Specify the purpose and context of your form</li>
                <li>• Mention if you need specific question types (ratings, file uploads, etc.)</li>
                <li>• Include any required fields or validation needs</li>
                <li>• Describe your target audience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 