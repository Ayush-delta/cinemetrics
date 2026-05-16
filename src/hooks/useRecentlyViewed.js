import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MAX_ITEMS = 20;

/**
 * Tracks recently viewed media items (movies + TV).
 * @returns {{ recentlyViewed: Array, addToRecentlyViewed: (item: object) => void, clearRecentlyViewed: () => void }}
 */
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('cinemetrics-recently-viewed', []);

  const addToRecentlyViewed = useCallback((item) => {
    if (!item?.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      return [{ ...item, _viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    });
  }, [setRecentlyViewed]);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, [setRecentlyViewed]);

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
}
