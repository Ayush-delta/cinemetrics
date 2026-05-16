import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getMovieDetails } from '../api/movies';
import { getImageUrl, formatRuntime, formatDate } from '../lib/utils';
import { useWatchlist } from '../context/WatchlistContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import MediaCard from '../components/media/MediaCard';
import Spinner from '../components/ui/Spinner';
import TrailerModal from '../components/media/TrailerModal';
import ReviewCard from '../components/media/ReviewCard';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { data: movie, isLoading, isError, error } = useQuery({
    queryKey: ['movie-detail', id],
    queryFn: ({ signal }) => getMovieDetails(id, signal),
    staleTime: 10 * 60 * 1000,
  });

  // Track recently viewed
  useEffect(() => {
    if (movie) {
      addToRecentlyViewed(movie);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [movie, addToRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Loading movie..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg">{error?.message || 'Failed to load movie.'}</p>
        <button className="btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  if (!movie) return null;

  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube',
  );
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const recommendations = movie.recommendations?.results?.slice(0, 12) || [];
  const similar = movie.similar?.results?.slice(0, 12) || [];
  const reviews = movie.reviews?.results?.slice(0, 4) || [];

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date?.split('-')[0] || 'N/A';
  const saved = isInWatchlist(movie.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${movie.title} - CineMetrics`,
          text: movie.overview,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'));
    }
  };

  return (
    <>
      <Helmet>
        <title>{movie.title} — CineMetrics</title>
        <meta name="description" content={movie.overview?.slice(0, 160)} />
        <meta property="og:title" content={movie.title} />
        <meta property="og:image" content={posterUrl} />
        <meta property="og:description" content={movie.overview?.slice(0, 160)} />
      </Helmet>

      <article className="text-white pb-24 animate-fade-in">
        {/* Backdrop hero */}
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
          {backdropUrl && (
            <motion.img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/60 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 btn-icon glass z-10"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Main content */}
        <div className="wrapper -mt-40 md:-mt-56 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0 mx-auto md:mx-0"
            >
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-48 md:w-64 lg:w-72 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-4 mt-0 md:mt-32 flex-1 min-w-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-amber gap-1.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="badge-violet">{releaseYear}</span>
                {movie.runtime > 0 && (
                  <span className="badge-cyan">{formatRuntime(movie.runtime)}</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-slate-400 italic text-lg">"{movie.tagline}"</p>
              )}

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span key={g.id} className="badge-violet">{g.name}</span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-slate-300 leading-relaxed">{movie.overview}</p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-2">
                {trailer && (
                  <button onClick={() => setIsTrailerOpen(true)} className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-lg shadow-black/20" id="watch-trailer-btn">
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Watch Trailer
                  </button>
                )}
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className={`btn ${saved
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30'
                    : 'btn-primary'
                  }`}
                  id="watchlist-toggle"
                >
                  {saved ? (
                    <>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      Add to Watchlist
                    </>
                  )}
                </button>
                <button onClick={handleShare} className="btn-ghost" id="share-btn">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {movie.release_date && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Release</p>
                    <p className="text-sm font-medium text-white">{formatDate(movie.release_date)}</p>
                  </div>
                )}
                {movie.status && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-medium text-white">{movie.status}</p>
                  </div>
                )}
                {movie.original_language && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Language</p>
                    <p className="text-sm font-medium text-white uppercase">{movie.original_language}</p>
                  </div>
                )}
                {movie.vote_count > 0 && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Votes</p>
                    <p className="text-sm font-medium text-white">{movie.vote_count.toLocaleString()}</p>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-sm font-medium text-white">${(movie.budget / 1e6).toFixed(0)}M</p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Revenue</p>
                    <p className="text-sm font-medium text-white">${(movie.revenue / 1e6).toFixed(0)}M</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <section className="mt-14">
              <h2 className="section-title text-xl font-bold text-white mb-6">Top Cast</h2>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
                {cast.map((c) => (
                  <div
                    key={c.cast_id || c.id}
                    className="group flex-shrink-0 w-[110px] glass rounded-2xl overflow-hidden hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/person/${c.id}`)}
                    role="button"
                    aria-label={c.name}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={c.profile_path ? getImageUrl(c.profile_path, 'w185') : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=333&color=fff&size=200`}
                        alt={c.name}
                        className="w-full aspect-square object-cover object-top"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=333&color=fff&size=200`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">Profile →</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-white line-clamp-1">{c.name}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{c.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Collection Banner */}
          {movie.belongs_to_collection && (
            <section 
              className="mt-14 relative rounded-3xl overflow-hidden glass border border-white/10 group cursor-pointer" 
              onClick={() => navigate(`/collection/${movie.belongs_to_collection.id}`)}
            >
              {movie.belongs_to_collection.backdrop_path && (
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <img src={getImageUrl(movie.belongs_to_collection.backdrop_path, 'w1280')} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left bg-gradient-to-r from-black/80 to-transparent">
                {movie.belongs_to_collection.poster_path && (
                  <img src={getImageUrl(movie.belongs_to_collection.poster_path, 'w185')} alt="" className="w-24 rounded-lg shadow-xl" />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Part of the {movie.belongs_to_collection.name}</h3>
                  <p className="text-slate-300 mb-4 text-sm max-w-lg">Includes {movie.title} and more from this iconic collection.</p>
                  <button className="btn bg-violet-600 hover:bg-violet-500 text-white border-none shadow-lg shadow-violet-500/20">View Collection</button>
                </div>
              </div>
            </section>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section className="mt-14">
              <h2 className="section-title text-xl font-bold text-white mb-6">Recommended</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {recommendations.map((item, i) => (
                  <MediaCard key={item.id} item={item} index={i} mediaType="movie" />
                ))}
              </div>
            </section>
          )}

          {/* Similar */}
          {similar.length > 0 && (
            <section className="mt-12">
              <h2 className="section-title text-xl font-bold text-white mb-6">Similar Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {similar.map((item, i) => (
                  <MediaCard key={item.id} item={item} index={i} mediaType="movie" />
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <section className="mt-14">
              <h2 className="section-title text-xl font-bold text-white mb-6">User Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
      <TrailerModal isOpen={isTrailerOpen} onClose={() => setIsTrailerOpen(false)} trailerKey={trailer?.key} />
    </>
  );
};

export default MovieDetail;
