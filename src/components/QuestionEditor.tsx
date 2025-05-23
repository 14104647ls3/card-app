'use client';
import { Question, QuestionType } from '../models/form';

export default function QuestionEditor({
  question,
  onChange,
}: {
  question: Question;
  onChange: (updated: Question) => void;
}) {
  const updateField = <T,>(field: keyof Question, value: T) => {
    onChange({ ...question, [field]: value });
  };

  const handleOptionsChange = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onChange({ ...question, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), 'New Option'];
    onChange({ ...question, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(question.options || [])];
    newOptions.splice(index, 1);
    onChange({ ...question, options: newOptions });
  };

  return (
    <div className="space-y-5">
      <div>
        <input
          className="w-full border-0 border-b border-pale-blue p-2 text-lg font-medium focus:ring-0 focus:border-sky-blue"
          value={question.label}
          onChange={(e) => updateField('label', e.target.value)}
          placeholder="Question text"
        />
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <select
            className="w-full border border-pale-blue rounded-md p-2 text-navy focus:border-sky-blue focus:ring-sky-blue"
            value={question.type}
            onChange={(e) => updateField('type', e.target.value as QuestionType)}
            aria-label="Question type"
            title="Select question type"
          >
            <option value="short">Short Answer</option>
            <option value="paragraph">Paragraph</option>
            <option value="radio">Multiple Choice</option>
            <option value="checkbox">Checkboxes</option>
          </select>
        </div>
        
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 text-ocean-blue focus:ring-sky-blue rounded"
            checked={question.isRequired}
            onChange={(e) => updateField('isRequired', e.target.checked)}
          />
          Required
        </label>
      </div>
      
      {(question.type === 'radio' || question.type === 'checkbox') && (
        <div className="bg-pale-blue bg-opacity-20 p-4 rounded-md border border-pale-blue">
          <h3 className="text-sm font-medium text-navy mb-2">Options</h3>
          <div className="space-y-2 mb-3">
            {question.options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 flex items-center justify-center text-gray-400">
                  {question.type === 'radio' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <input
                  className="flex-1 border border-pale-blue rounded p-2 text-sm"
                  value={opt}
                  onChange={(e) => handleOptionsChange(i, e.target.value)}
                  placeholder="Option text"
                />
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  onClick={() => removeOption(i)}
                  aria-label="Remove option"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-ocean-blue hover:text-deep-blue font-medium"
            onClick={addOption}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Add Option
          </button>
        </div>
      )}
      
      {/* Preview section */}
      <div className="border-t border-pale-blue pt-4 mt-4">
        <div className="text-sm text-gray-500 mb-2">Preview</div>
        <div className="bg-white p-4 rounded-md border border-gray-200">
          {question.type === 'short' && (
            <div>
              <label className="block font-medium text-navy mb-1">{question.label || 'Untitled Question'}</label>
              <input 
                type="text" 
                className="w-full border border-pale-blue rounded-md p-2" 
                disabled 
                placeholder="Short answer text" 
                aria-label="Preview input"
                title="Preview of short answer field"
              />
            </div>
          )}
          
          {question.type === 'paragraph' && (
            <div>
              <label className="block font-medium text-navy mb-1">{question.label || 'Untitled Question'}</label>
              <textarea 
                className="w-full border border-pale-blue rounded-md p-2" 
                disabled 
                placeholder="Long answer text" 
                rows={2}
                aria-label="Preview textarea"
                title="Preview of paragraph field"
              ></textarea>
            </div>
          )}
          
          {question.type === 'radio' && (
            <div>
              <label className="block font-medium text-navy mb-2">{question.label || 'Untitled Question'}</label>
              <div className="space-y-1">
                {(question.options?.length ? question.options : ['Option 1']).map((opt, i) => (
                  <div key={i} className="flex items-center">
                    <input 
                      type="radio" 
                      disabled 
                      className="h-4 w-4 text-ocean-blue focus:ring-sky-blue" 
                      title={`Preview of option ${i+1}`}
                      aria-label={`Preview of option ${i+1}`}
                    />
                    <label className="ml-2 text-gray-600">{opt}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {question.type === 'checkbox' && (
            <div>
              <label className="block font-medium text-navy mb-2">{question.label || 'Untitled Question'}</label>
              <div className="space-y-1">
                {(question.options?.length ? question.options : ['Option 1']).map((opt, i) => (
                  <div key={i} className="flex items-center">
                    <input 
                      type="checkbox" 
                      disabled 
                      className="h-4 w-4 text-ocean-blue focus:ring-sky-blue rounded" 
                      title={`Preview of option ${i+1}`}
                      aria-label={`Preview of option ${i+1}`}
                    />
                    <label className="ml-2 text-gray-600">{opt}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
