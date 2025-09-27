import React from 'react';
import type { View } from '../App';
import { CogIcon } from './icons/CogIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { InboxIcon } from './icons/InboxIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isAuthenticated: boolean;
  onLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isAuthenticated, onLock }) => {
  const baseClasses = 'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2';
  const activeClasses = 'bg-indigo-600 text-white';
  const inactiveClasses = 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Business Directory
      </h1>
      <nav className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <button
          onClick={() => onNavigate('map')}
          className={`${baseClasses} ${currentView === 'map' ? activeClasses : inactiveClasses}`}
        >
          Karte
        </button>
         <button
          onClick={() => onNavigate('guestbook')}
          className={`${baseClasses} ${currentView === 'guestbook' ? activeClasses : inactiveClasses}`}
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Gästebuch</span>
        </button>
        <button
          onClick={() => onNavigate('inbox')}
          className={`${baseClasses} ${currentView === 'inbox' ? activeClasses : inactiveClasses}`}
        >
          <InboxIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Eingang</span>
        </button>
        <button
          onClick={() => onNavigate('management')}
          className={`${baseClasses} ${currentView === 'management' ? activeClasses : inactiveClasses}`}
        >
          Verwaltung
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`${baseClasses} ${currentView === 'settings' ? activeClasses : inactiveClasses}`}
          aria-label="Einstellungen"
        >
          <CogIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Einstellungen</span>
        </button>
        {isAuthenticated && (
           <button
             onClick={onLock}
             className={`${baseClasses} ${inactiveClasses} bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900`}
             aria-label="Sperren"
           >
             <LockClosedIcon className="w-5 h-5" />
           </button>
        )}
      </nav>
    </header>
  );
};
