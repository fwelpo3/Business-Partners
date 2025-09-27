import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface SuggestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (suggestion: string) => void;
}

export const SuggestionForm: React.FC<SuggestionFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSuggestion('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestion.trim()) {
      onSubmit(suggestion.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 m-4 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          aria-label="Schließen"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Vorschlag machen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ihr Vorschlag</label>
            <textarea
              id="suggestion"
              rows={5}
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"
              placeholder="Geben Sie hier Ihren Vorschlag ein..."
              autoFocus
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Senden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
