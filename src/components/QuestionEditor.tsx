'use client';
import { Question, QuestionType } from '../models/form';

export default function QuestionEditor({
  question,
  onChange,
}: {
  question: Question;
  onChange: (updated: Question) => void;
}) {
  const updateField = (field: keyof Question, value: any) => {
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
    <div className="border p-4 rounded space-y-2">
      <input
        className="w-full border p-2 font-medium"
        value={question.label}
        onChange={(e) => updateField('label', e.target.value)}
      />
      <select
        className="border p-2 w-full"
        value={question.type}
        onChange={(e) => updateField('type', e.target.value as QuestionType)}
          >
        <option value="short">Short Answer</option>
        <option value="paragraph">Paragraph</option>
        <option value="radio">Multiple Choice</option>
        <option value="checkbox">Checkboxes</option>
      </select>
      {(question.type === 'radio' || question.type === 'checkbox') && (
        <div className="space-y-1">
          {question.options?.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 border p-2"
                value={opt}
                onChange={(e) => handleOptionsChange(i, e.target.value)}
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => removeOption(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-blue-600 mt-1"
            onClick={addOption}
          >
            + Add Option
          </button>
        </div>
      )}
      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={question.isRequired}
          onChange={(e) => updateField('isRequired', e.target.checked)}
        />
        Required
      </label>
    </div>
  );
}
