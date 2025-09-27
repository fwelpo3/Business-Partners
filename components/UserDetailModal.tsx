
import React from 'react';
import type { User } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  const formattedAddressLine1 = [user.street, user.houseNumber].filter(Boolean).join(' ');
  const formattedAddressLine2 = [user.postalCode, user.city].filter(Boolean).join(' ');
  const fullAddress = [formattedAddressLine1, formattedAddressLine2].filter(Boolean).join(', ');

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-6 m-4 bg-white rounded-lg shadow-xl dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <p className="text-lg text-indigo-600 dark:text-indigo-400">{user.company}</p>

        <div className="mt-6 space-y-4 text-sm">
          {user.phone && (
            <div className="flex">
              <strong className="w-1/3">Telefon:</strong>
              <span className="w-2/3">{user.phone}</span>
            </div>
          )}
          {fullAddress && (
             <div className="flex">
              <strong className="w-1/3">Adresse:</strong>
              <span className="w-2/3">{fullAddress}</span>
            </div>
          )}
          {user.website && (
            <div className="flex">
              <strong className="w-1/3">Webseite:</strong>
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="w-2/3 text-indigo-500 hover:underline break-all">
                {user.website}
              </a>
            </div>
          )}
          {user.description && (
            <div className="flex flex-col">
              <strong className="mb-1">Beschreibung:</strong>
              <p className="p-3 bg-gray-100 rounded-md dark:bg-gray-700">{user.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};