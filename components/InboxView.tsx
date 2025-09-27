import React from 'react';
import type { InboxItem } from '../types';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { TrashIcon } from './icons/TrashIcon';

interface InboxViewProps {
  items: InboxItem[];
  onDeleteItem: (item: InboxItem) => void;
}

const ItemCard: React.FC<{ item: InboxItem; onDelete: () => void }> = ({ item, onDelete }) => {
  const isQuestion = item.type === 'question';
  const Icon = isQuestion ? QuestionMarkCircleIcon : LightBulbIcon;
  const badgeText = isQuestion ? 'Frage' : 'Vorschlag';
  const badgeColor = isQuestion ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
  const iconColor = isQuestion ? 'text-yellow-500' : 'text-green-500';

  const formattedDate = new Date(item.createdAt).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {badgeText}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Eintrag löschen"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {item.content}
      </p>
    </div>
  );
};


export const InboxView: React.FC<InboxViewProps> = ({ items, onDeleteItem }) => {
  return (
    <div className="flex-grow p-4 md:p-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Eingang</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Hier finden Sie alle gestellten Fragen und Vorschläge.</p>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Keine Einträge</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fragen und Vorschläge werden hier angezeigt.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map(item => (
              <ItemCard key={item.id} item={item} onDelete={() => onDeleteItem(item)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
