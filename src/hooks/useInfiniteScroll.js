import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Triggers `onLoadMore` when the sentinel element enters viewport.
 * @param {{ onLoadMore: () => void, hasNextPage: boolean, isFetchingNextPage: boolean, threshold?: number }} options
 * @returns {{ ref: (node: Element|null) => void }}
 */
export function useInfiniteScroll({ onLoadMore, hasNextPage, isFetchingNextPage, threshold = 0.1 }) {
  const { ref, inView } = useInView({ threshold });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  return { ref };
}
