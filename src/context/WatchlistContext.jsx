import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext(null);

const STORAGE_KEY = 'cinemetrics-watchlist';

// Watchlist categories
export const WATCHLIST_CATEGORIES = {
  plan: 'Plan to Watch',
  watching: 'Watching',
  completed: 'Completed',
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch { /* quota exceeded */ }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(loadFromStorage);

  // Persist on every change
  useEffect(() => {
    saveToStorage(watchlist);
  }, [watchlist]);

  const isInWatchlist = useCallback(
    (id) => watchlist.some((item) => item.id === id),
    [watchlist],
  );

  const getWatchlistItem = useCallback(
    (id) => watchlist.find((item) => item.id === id) || null,
    [watchlist],
  );

  /** Add with default category 'plan' */
  const addToWatchlist = useCallback((media, category = 'plan') => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === media.id)) return prev;
      return [
        ...prev,
        {
          ...media,
          _category: category,
          _addedAt: Date.now(),
          _rating: null,
          _notes: '',
        },
      ];
    });
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => prev.filter((i) => i.id !== id));
  }, []);

  /** Toggle: add to 'plan' or remove */
  const toggleWatchlist = useCallback((media) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === media.id);
      if (exists) return prev.filter((i) => i.id !== media.id);
      return [
        ...prev,
        { ...media, _category: 'plan', _addedAt: Date.now(), _rating: null, _notes: '' },
      ];
    });
  }, []);

  /** Move item between categories */
  const moveCategory = useCallback((id, category) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, _category: category } : item)),
    );
  }, []);

  /** Update rating and notes */
  const updateItem = useCallback((id, updates) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }, []);

  /** Export watchlist as JSON */
  const exportWatchlist = useCallback(() => {
    const json = JSON.stringify(watchlist, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cinemetrics-watchlist.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [watchlist]);

  /** Import watchlist from JSON */
  const importWatchlist = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) setWatchlist(parsed);
    } catch {
      console.error('Invalid watchlist JSON');
    }
  }, []);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isInWatchlist,
        getWatchlistItem,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        moveCategory,
        updateItem,
        exportWatchlist,
        importWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return ctx;
}
