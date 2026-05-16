import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCollectionDetails } from '../api/movies';
import { getImageUrl } from '../lib/utils';
import Spinner from '../components/ui/Spinner';
import MediaCard from '../components/media/MediaCard';

const CollectionDetail = () => {
  const { id } = useParams();

  const { data: collection, isLoading, isError, error } = useQuery({
    queryKey: ['collection-detail', id],
    queryFn: ({ signal }) => getCollectionDetails(id, signal),
  });

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;
  if (isError) return <div className="text-center text-red-500 py-10">Error loading collection: {error.message}</div>;
  if (!collection) return <div className="text-center py-10">Collection not found</div>;

  const sortedParts = collection.parts?.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)) || [];

  return (
    <>
      <Helmet>
        <title>{collection.name} - CineMetrics</title>
      </Helmet>

      <div className="relative pt-[20vh] pb-16 min-h-screen">
        {/* Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={getImageUrl(collection.backdrop_path, 'original')}
            alt={collection.name}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/80 to-transparent" />
        </div>

        <div className="wrapper relative z-10 flex flex-col items-center text-center">
          <img
            src={getImageUrl(collection.poster_path, 'w500')}
            alt={collection.name}
            className="w-48 sm:w-64 rounded-2xl shadow-2xl mb-8 border border-white/10"
          />
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{collection.name}</h1>
          <p className="max-w-2xl text-slate-300 text-lg mb-12">{collection.overview}</p>

          <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-6 text-left">Movies ({sortedParts.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {sortedParts.map((movie) => (
                <MediaCard key={movie.id} item={movie} type="movie" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionDetail;
