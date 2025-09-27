import { useState, useEffect, useCallback } from 'react';
import type { InboxItem, InboxItemType } from '../types';

const STORAGE_KEY = 'business_directory_inbox';

export const useInbox = () => {
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setInboxItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to load inbox items from localStorage', error);
      setInboxItems([]);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inboxItems));
      } catch (error) {
        console.error('Failed to save inbox items to localStorage', error);
      }
    }
  }, [inboxItems, isInitialized]);

  const addInboxItem = useCallback((content: string, type: InboxItemType) => {
    const newItem: InboxItem = {
      id: crypto.randomUUID(),
      type,
      content,
      createdAt: new Date().toISOString(),
    };
    // Add new items to the top of the list
    setInboxItems(prevItems => [newItem, ...prevItems]);
  }, []);

  const deleteInboxItem = useCallback((id: string) => {
    setInboxItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const overwriteInboxItems = useCallback((items: InboxItem[]) => {
    setInboxItems(items);
  }, []);


  return { inboxItems, addInboxItem, deleteInboxItem, overwriteInboxItems, isInitialized };
};