
import React from 'react';
import type { User } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ManagementViewProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const ManagementView: React.FC<ManagementViewProps> = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div className="flex-grow p-4 md:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Einträge verwalten</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">Noch keine Einträge vorhanden. Fügen Sie einen auf der Karte hinzu.</p>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.company} - {user.phone}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEditUser(user)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Eintrag von ${user.name} bearbeiten`}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteUser(user)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Eintrag von ${user.name} löschen`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
