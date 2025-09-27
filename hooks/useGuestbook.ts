import { useState, useEffect, useCallback } from 'react';
import type { GuestbookEntry, GuestbookReply } from '../types';

const STORAGE_KEY = 'business_directory_guestbook';

export const useGuestbook = () => {
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setGuestbookEntries(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to load guestbook entries from localStorage', error);
      setGuestbookEntries([]);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guestbookEntries));
      } catch (error) {
        console.error('Failed to save guestbook entries to localStorage', error);
      }
    }
  }, [guestbookEntries, isInitialized]);

  const addGuestbookEntry = useCallback((authorName: string, title: string, content: string) => {
    const newEntry: GuestbookEntry = {
      id: crypto.randomUUID(),
      authorName,
      title,
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setGuestbookEntries(prevEntries => [newEntry, ...prevEntries]);
  }, []);

  const addGuestbookReply = useCallback((entryId: string, authorName: string, content: string) => {
    const newReply: GuestbookReply = {
      id: crypto.randomUUID(),
      authorName,
      content,
      createdAt: new Date().toISOString(),
    };
    
    setGuestbookEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            replies: [...entry.replies, newReply],
          };
        }
        return entry;
      })
    );
  }, []);
  
  const overwriteGuestbookEntries = useCallback((entries: GuestbookEntry[]) => {
    setGuestbookEntries(entries);
  }, []);

  return { guestbookEntries, addGuestbookEntry, addGuestbookReply, overwriteGuestbookEntries, isInitialized };
};