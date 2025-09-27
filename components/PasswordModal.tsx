
import React, { useState, useEffect } from 'react';

type PasswordModalMode = 'setup' | 'login';

interface PasswordModalProps {
  isOpen: boolean;
  mode: PasswordModalMode;
  onClose: () => void;
  onSubmit: (password: string) => void;
  errorMessage?: string | null;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, mode, onClose, onSubmit, errorMessage }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword(''); // Reset on open
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  const title = mode === 'setup' ? 'Passwort festlegen' : 'Zugriff erforderlich';
  const description = mode === 'setup' 
    ? 'Da Sie zum ersten Mal auf einen geschützten Bereich zugreifen, legen Sie bitte ein Passwort fest. Dieses wird lokal auf Ihrem Gerät gespeichert.' 
    : 'Bitte geben Sie Ihr Passwort ein, um fortzufahren.';
  const buttonText = mode === 'setup' ? 'Passwort festlegen' : 'Entsperren';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm p-6 m-4 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="password-modal" className="sr-only">Passwort</label>
            <input
              id="password-modal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"
              autoFocus
            />
             {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
