import React, { useRef, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import MediaCard from './MediaCard';
import SkeletonCard from '../ui/SkeletonCard';
import Spinner from '../ui/Spinner';

/**
 * MediaGrid — fetches data via TanStack Query infinite, renders MediaCards, auto-paginates.
 *
 * @param {{
 *   queryKey: any[],
 *   queryFn: ({ pageParam: number }) => Promise<any>,
 *   mediaType?: 'movie'|'tv',
 *   emptyMessage?: string,
 * }} props
 */
const MediaGrid = ({ queryKey, queryFn, mediaType, emptyMessage = 'No results found.' }) => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn({ pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  // Trigger next page when sentinel is visible
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((page) => page.results) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-slate-400 text-center">{error?.message || 'Failed to load content.'}</p>
        <button onClick={refetch} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-5xl">🎬</div>
        <p className="text-slate-400 text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <MediaCard
            key={`${item.id}-${index}`}
            item={item}
            index={index % 12}
            mediaType={mediaType || (item.title ? 'movie' : 'tv')}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={ref} className="flex justify-center py-8">
        {isFetchingNextPage && <Spinner size="md" />}
      </div>
    </>
  );
};

export default MediaGrid;
