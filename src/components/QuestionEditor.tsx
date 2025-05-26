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

  const handleFileTypeChange = (index: number, value: string) => {
    const newTypes = [...(question.acceptedFileTypes || [])];
    newTypes[index] = value;
    onChange({ ...question, acceptedFileTypes: newTypes });
  };

  const addFileType = () => {
    const newTypes = [...(question.acceptedFileTypes || []), '.pdf'];
    onChange({ ...question, acceptedFileTypes: newTypes });
  };

  const removeFileType = (index: number) => {
    const newTypes = [...(question.acceptedFileTypes || [])];
    newTypes.splice(index, 1);
    onChange({ ...question, acceptedFileTypes: newTypes });
  };

  return (
    <div className="space-y-5">
      <div>
        <input
          className="w-full border-0 border-b border-pale-blue p-2 text-lg font-medium focus:ring-0 focus:border-sky-blue"
          value={question.label}
          onFocus={(e) => e.target.select()}
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
            <option value="file">File Upload</option>
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

      {question.type === 'file' && (
        <div className="bg-pale-blue bg-opacity-20 p-4 rounded-md border border-pale-blue">
          <h3 className="text-sm font-medium text-navy mb-3">File Upload Settings</h3>
          
          {/* Max file size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              className="w-full border border-pale-blue rounded p-2 text-sm"
              value={question.maxFileSize ? question.maxFileSize / (1024 * 1024) : 10}
              onChange={(e) => updateField('maxFileSize', parseFloat(e.target.value) * 1024 * 1024)}
              placeholder="10"
              min="1"
              max="100"
            />
          </div>

          {/* Accepted file types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accepted File Types (optional)
            </label>
            <div className="space-y-2 mb-3">
              {question.acceptedFileTypes?.map((type, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    className="flex-1 border border-pale-blue rounded p-2 text-sm"
                    value={type}
                    onChange={(e) => handleFileTypeChange(i, e.target.value)}
                    placeholder=".pdf, .doc, .jpg"
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    onClick={() => removeFileType(i)}
                    aria-label="Remove file type"
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
              onClick={addFileType}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Add File Type
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Leave empty to allow all file types. Use extensions like .pdf, .doc, .jpg
            </p>
          </div>
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

          {question.type === 'file' && (
            <div>
              <label className="block font-medium text-navy mb-2">{question.label || 'Untitled Question'}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="mx-auto w-8 h-8 text-gray-400 mb-2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                {question.acceptedFileTypes && question.acceptedFileTypes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: {question.acceptedFileTypes.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Max size: {question.maxFileSize ? `${(question.maxFileSize / (1024 * 1024)).toFixed(1)} MB` : '10 MB'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
