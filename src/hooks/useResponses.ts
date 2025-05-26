import { useEffect, useState } from 'react';
import { Form } from '@/models/form';

interface QuickStats {
  totalSubmissions: number;
  numberOfQuestions: number;
}

interface QuestionAnswers {
  questionId: string;
  questionLabel: string;
  questionType: string;
  answers: Array<{
    responseId: string;
    questionType: string;
    value: unknown;
    submittedAt: Date;
  }>;
}

interface ResponsesData {
  quickStats: QuickStats;
  groupedAnswers: QuestionAnswers[];
  allResponses: unknown[];
}

export function useResponses() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [responsesData, setResponsesData] = useState<ResponsesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all forms for the sidebar
  useEffect(() => {
    fetch('/api/forms')
      .then(res => res.json())
      .then(data => setForms(data))
      .catch(err => console.error('Error fetching forms:', err));
  }, []);

  // Fetch responses for selected form using new API structure
  const fetchFormResponses = async (formId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch quick stats
      const statsResponse = await fetch(`/api/forms/${formId}/responses?action=stats`);
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats');
      }
      const quickStats = await statsResponse.json();

      // Fetch grouped answers
      const groupedResponse = await fetch(`/api/forms/${formId}/responses?action=grouped`);
      if (!groupedResponse.ok) {
        throw new Error('Failed to fetch grouped answers');
      }
      const groupedAnswers = await groupedResponse.json();

      // Fetch all responses
      const allResponse = await fetch(`/api/forms/${formId}/responses`);
      if (!allResponse.ok) {
        throw new Error('Failed to fetch all responses');
      }
      const allResponses = await allResponse.json();

      setResponsesData({
        quickStats,
        groupedAnswers,
        allResponses
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResponsesData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSelect = (form: Form) => {
    setSelectedForm(form);
    fetchFormResponses(form._id);
  };

  const retryFetch = () => {
    if (selectedForm) {
      fetchFormResponses(selectedForm._id);
    }
  };

  return {
    forms,
    selectedForm,
    responsesData,
    loading,
    error,
    handleFormSelect,
    retryFetch
  };
} 