'use client';

import { useState } from 'react';

interface QuickStats {
    totalSubmissions: number;
    numberOfQuestions: number;
    answeredQuestions: number;
}

interface QuestionAnswers {
    questionId: string;
    questionLabel: string;
    questionType: string;
    answers: Array<{
        responseId: string;
        value: any;
        submittedAt: string;
    }>;
}

interface FormResponse {
    _id: string;
    formId: string;
    answers: Array<{
        questionId: string;
        value: any;
    }>;
    submittedAt: string;
}

export default function TestAPIPage() {
    const [formId, setFormId] = useState('');
    const [loading, setLoading] = useState(false);
    const [allResponses, setAllResponses] = useState<FormResponse[]>([]);
    const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
    const [groupedAnswers, setGroupedAnswers] = useState<QuestionAnswers[]>([]);
    const [error, setError] = useState('');

    const testAllResponses = async () => {
        if (!formId) {
            setError('Please enter a form ID');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`/api/forms/${formId}/responses`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch responses');
            }
            
            setAllResponses(data);
            console.log('All Responses:', data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const testQuickStats = async () => {
        if (!formId) {
            setError('Please enter a form ID');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`/api/forms/${formId}/responses?action=stats`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch stats');
            }
            
            setQuickStats(data);
            console.log('Quick Stats:', data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const testGroupedAnswers = async () => {
        if (!formId) {
            setError('Please enter a form ID');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`/api/forms/${formId}/responses?action=grouped`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch grouped answers');
            }
            
            setGroupedAnswers(data);
            console.log('Grouped Answers:', data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setAllResponses([]);
        setQuickStats(null);
        setGroupedAnswers([]);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">API Testing Page</h1>
                
                {/* Form ID Input */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Test Form Responses API</h2>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label htmlFor="formId" className="block text-sm font-medium text-gray-700 mb-2">
                                Form ID
                            </label>
                            <input
                                type="text"
                                id="formId"
                                value={formId}
                                onChange={(e) => setFormId(e.target.value)}
                                placeholder="Enter form ID (e.g., 507f1f77bcf86cd799439011)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={clearResults}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Clear Results
                        </button>
                    </div>
                </div>

                {/* API Test Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={testAllResponses}
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Loading...' : 'Test All Responses'}
                    </button>
                    
                    <button
                        onClick={testQuickStats}
                        disabled={loading}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Loading...' : 'Test Quick Stats'}
                    </button>
                    
                    <button
                        onClick={testGroupedAnswers}
                        disabled={loading}
                        className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Loading...' : 'Test Grouped Answers'}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Results Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* All Responses */}
                    {allResponses.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 text-blue-600">
                                All Responses ({allResponses.length})
                            </h3>
                            <div className="max-h-96 overflow-y-auto">
                                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                                    {JSON.stringify(allResponses, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    {quickStats && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 text-green-600">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="font-medium">Total Submissions:</span>
                                    <span className="text-xl font-bold text-blue-600">{quickStats.totalSubmissions}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="font-medium">Number of Questions:</span>
                                    <span className="text-xl font-bold text-green-600">{quickStats.numberOfQuestions}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="font-medium">Answered Questions:</span>
                                    <span className="text-xl font-bold text-purple-600">{quickStats.answeredQuestions}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Raw JSON:</h4>
                                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                                    {JSON.stringify(quickStats, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Grouped Answers */}
                    {groupedAnswers.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4 text-purple-600">
                                Grouped Question Answers ({groupedAnswers.length} questions)
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {groupedAnswers.map((question, index) => (
                                    <div key={question.questionId} className="border border-gray-200 rounded p-4">
                                        <div className="mb-2">
                                            <span className="text-sm text-gray-500">Question {index + 1} ({question.questionType})</span>
                                            <h4 className="font-medium">{question.questionLabel}</h4>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            {question.answers.length} answer(s)
                                        </div>
                                        {question.answers.length > 0 && (
                                            <div className="bg-gray-50 p-3 rounded">
                                                <h5 className="text-sm font-medium mb-2">Sample Answers:</h5>
                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                    {question.answers.slice(0, 3).map((answer, answerIndex) => (
                                                        <div key={answerIndex} className="text-xs">
                                                            <strong>Value:</strong> {JSON.stringify(answer.value)} 
                                                            <span className="text-gray-500 ml-2">
                                                                ({new Date(answer.submittedAt).toLocaleDateString()})
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {question.answers.length > 3 && (
                                                        <div className="text-xs text-gray-500">
                                                            ... and {question.answers.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <details>
                                    <summary className="cursor-pointer font-medium text-sm">View Raw JSON</summary>
                                    <pre className="text-xs bg-gray-100 p-3 rounded mt-2 overflow-x-auto max-h-64 overflow-y-auto">
                                        {JSON.stringify(groupedAnswers, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        </div>
                    )}
                </div>

                {/* API Documentation */}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">API Endpoints Documentation</h3>
                    <div className="space-y-4 text-sm">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium">GET /api/forms/[id]/responses</h4>
                            <p className="text-gray-600">Returns all form responses with cleaned data</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-medium">GET /api/forms/[id]/responses?action=stats</h4>
                            <p className="text-gray-600">Returns quick statistics for ResponsesContent.tsx</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-medium">GET /api/forms/[id]/responses?action=grouped</h4>
                            <p className="text-gray-600">Returns responses grouped by each question</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 