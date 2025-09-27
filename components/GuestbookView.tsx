import React, { useState } from 'react';
import type { GuestbookEntry, GuestbookReply } from '../types';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';

interface GuestbookViewProps {
  entries: GuestbookEntry[];
  onAddEntry: (authorName: string, title: string, content: string) => void;
  onAddReply: (entryId: string, authorName: string, content: string) => void;
}

const NewEntryForm: React.FC<{ onAddEntry: GuestbookViewProps['onAddEntry'] }> = ({ onAddEntry }) => {
    const [authorName, setAuthorName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authorName.trim() && title.trim() && content.trim()) {
            onAddEntry(authorName, title, content);
            setAuthorName('');
            setTitle('');
            setContent('');
        } else {
            alert("Bitte füllen Sie alle Felder aus.");
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Neuer Gästebucheintrag</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ihr Name</label>
                        <input type="text" id="authorName" value={authorName} onChange={e => setAuthorName(e.target.value)} required className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Titel</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full input-style" />
                    </div>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nachricht</label>
                    <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={4} className="mt-1 block w-full input-style"></textarea>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                        Veröffentlichen
                    </button>
                </div>
            </form>
        </div>
    );
};

const ReplyForm: React.FC<{ entryId: string; onAddReply: GuestbookViewProps['onAddReply'] }> = ({ entryId, onAddReply }) => {
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authorName.trim() && content.trim()) {
            onAddReply(entryId, authorName, content);
            setAuthorName('');
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
             <input 
                type="text" 
                placeholder="Ihr Name" 
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                required
                className="w-full input-style text-sm"
             />
             <textarea
                placeholder="Ihre Antwort..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={2}
                className="w-full input-style text-sm"
            ></textarea>
            <div className="flex justify-end">
                <button type="submit" className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-semibold rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
                    Antworten
                </button>
            </div>
        </form>
    );
}

const EntryCard: React.FC<{ entry: GuestbookEntry, onAddReply: GuestbookViewProps['onAddReply'] }> = ({ entry, onAddReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const formattedDate = new Date(entry.createdAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{entry.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Von <span className="font-semibold">{entry.authorName}</span> am {formattedDate}
                    </p>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 my-4">{entry.content}</p>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                 <div className="flex justify-between items-center">
                    <h5 className="font-semibold text-gray-600 dark:text-gray-300">
                        {entry.replies.length} {entry.replies.length === 1 ? 'Antwort' : 'Antworten'}
                    </h5>
                    <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                        {showReplyForm ? 'Abbrechen' : 'Antworten'}
                    </button>
                 </div>

                {entry.replies.map(reply => (
                    <div key={reply.id} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200">{reply.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            – <span className="font-medium">{reply.authorName}</span> am {new Date(reply.createdAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                    </div>
                ))}

                {showReplyForm && <ReplyForm entryId={entry.id} onAddReply={onAddReply} />}
            </div>
        </div>
    );
};

export const GuestbookView: React.FC<GuestbookViewProps> = ({ entries, onAddEntry, onAddReply }) => {
  return (
    <div className="flex-grow p-4 md:p-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
      <style>{`.input-style { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; color: #111827; } .dark .input-style { background-color: #374151; border-color: #4B5563; color: #F3F4F6; }`}</style>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gästebuch</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Hinterlassen Sie eine Nachricht oder diskutieren Sie mit anderen.</p>
        </div>
        
        <NewEntryForm onAddEntry={onAddEntry} />

        {entries.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Noch keine Einträge</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Seien Sie der Erste, der einen Eintrag hinterlässt!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map(entry => (
              <EntryCard key={entry.id} entry={entry} onAddReply={onAddReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
