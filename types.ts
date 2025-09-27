export interface User {
  id: string;
  name: string; // Pflichtfeld
  company: string; // Pflichtfeld
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  website?: string;
  description?: string;
  coords: {
    lat: number;
    lng: number;
  };
}

export type NewUser = Omit<User, 'id' | 'coords'>;

export type InboxItemType = 'question' | 'suggestion';

export interface InboxItem {
  id: string;
  type: InboxItemType;
  content: string;
  createdAt: string; // ISO string
}

export interface GuestbookReply {
  id: string;
  authorName: string;
  content: string;
  createdAt: string; // ISO string
}

export interface GuestbookEntry {
  id: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  replies: GuestbookReply[];
}
