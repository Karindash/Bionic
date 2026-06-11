export type View = 'dashboard' | 'library' | 'rsvp' | 'doc' | 'converter' | 'sandbox';

export interface Book {
  id: string;
  title: string;
  format: string;
  text: string;
  dateAdded: string;
}

export interface Activity {
  title: string;
  date: string;
  type: 'Doc' | 'RSVP' | 'Converter' | 'Library';
  timestamp: number;
}
