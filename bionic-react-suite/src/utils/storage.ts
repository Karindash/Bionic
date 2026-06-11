export const STORAGE_KEYS = {
  BOOKS: 'bionic_reader_books',
  RECENT_ACTIVITY: 'bionic_reader_activity',
  SETTINGS: 'bionic_reader_settings'
};

export const storage = {
  save: (key: string, data: any) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  load: <T>(key: string, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return defaultValue;
    }
  },

  clear: (key: string) => {
    localStorage.removeItem(key);
  }
};
