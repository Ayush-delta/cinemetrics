import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { getPopularPeople } from '../api/people';
import { getImageUrl } from '../lib/utils';
import Spinner from '../components/ui/Spinner';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useEffect } from 'react';

const People = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1 });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['popular-people'],
    queryFn: ({ pageParam = 1 }) => getPopularPeople(pageParam),
    getNextPageParam: (last) => (last.page < last.total_pages ? last.page + 1 : undefined),
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const people = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <>
      <Helmet>
        <title>People — CineMetrics</title>
        <meta name="description" content="Explore popular actors, directors, and other industry personalities." />
      </Helmet>

      <main className="wrapper py-8 page-enter">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">People</h1>
          <p className="text-slate-400 text-sm">Popular actors, directors & industry figures</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : isError ? (
          <p className="text-red-400 text-center py-20">Failed to load people.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {people.map((person) => (
                <button
                  key={person.id}
                  onClick={() => navigate(`/person/${person.id}`)}
                  className="glass rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] cursor-pointer"
                  aria-label={person.name}
                  id={`person-${person.id}`}
                >
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={getImageUrl(person.profile_path, 'w342')}
                      alt={person.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                      onError={(e) => { e.target.src = '/no-movie.png'; }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{person.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {person.known_for_department || 'Actor'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div ref={ref} className="flex justify-center py-8">
              {isFetchingNextPage && <Spinner />}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default People;
