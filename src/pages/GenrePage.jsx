import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import MediaGrid from '../components/media/MediaGrid';
import { discoverMovies } from '../api/movies';

const GenrePage = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name || 'Unknown');

  return (
    <>
      <Helmet>
        <title>{decodedName} Movies — CineMetrics</title>
        <meta name="description" content={`Browse ${decodedName} movies on CineMetrics.`} />
      </Helmet>

      <main className="wrapper py-8 page-enter">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 text-sm">
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">{decodedName}</h1>
          <p className="text-slate-400 text-sm">Browse all {decodedName} movies</p>
        </div>

        <MediaGrid
          queryKey={['genre-movies', id]}
          queryFn={({ pageParam }) => discoverMovies({ genre: id, page: pageParam })}
          mediaType="movie"
          emptyMessage={`No ${decodedName} movies found.`}
        />
      </main>
    </>
  );
};

export default GenrePage;
