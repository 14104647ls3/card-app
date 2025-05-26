import { useEffect, useState } from 'react';
import { Form } from '@/models/form';

interface QuestionStatistics {
  questionId: string;
  questionLabel: string;
  questionType: string;
  totalAnswers: number;
  statistics?: {
    [option: string]: {
      count: number;
      percentage: number;
    };
  };
}

interface ResponsesData {
  formId: string;
  formTitle: string;
  totalResponses: number;
  questionStatistics: QuestionStatistics[];
  responses: unknown[];
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

  // Fetch responses for selected form
  const fetchFormResponses = async (formId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/forms/${formId}/responses`);
      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }
      const data = await response.json();
      setResponsesData(data);
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