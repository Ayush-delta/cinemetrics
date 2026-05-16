import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getTVDetails } from '../api/tv';
import { getImageUrl, formatDate } from '../lib/utils';
import { useWatchlist } from '../context/WatchlistContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import MediaCard from '../components/media/MediaCard';
import Spinner from '../components/ui/Spinner';
import TrailerModal from '../components/media/TrailerModal';
import ReviewCard from '../components/media/ReviewCard';

const TVDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { data: show, isLoading, isError, error } = useQuery({
    queryKey: ['tv-detail', id],
    queryFn: ({ signal }) => getTVDetails(id, signal),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (show) {
      addToRecentlyViewed({ ...show, media_type: 'tv' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [show, addToRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Loading TV show..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error?.message || 'Failed to load show.'}</p>
        <button className="btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  if (!show) return null;

  const trailer = show.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const recommendations = show.recommendations?.results?.slice(0, 12) || [];
  const similar = show.similar?.results?.slice(0, 12) || [];
  const reviews = show.reviews?.results?.slice(0, 4) || [];
  const backdropUrl = getImageUrl(show.backdrop_path, 'original');
  const posterUrl = getImageUrl(show.poster_path, 'w500');
  const year = show.first_air_date?.split('-')[0] || 'N/A';
  const saved = isInWatchlist(show.id);

  return (
    <>
      <Helmet>
        <title>{show.name} — CineMetrics</title>
        <meta name="description" content={show.overview?.slice(0, 160)} />
        <meta property="og:title" content={show.name} />
        <meta property="og:image" content={posterUrl} />
      </Helmet>

      <article className="text-white pb-24 animate-fade-in">
        {/* Backdrop */}
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
          {backdropUrl && (
            <img src={backdropUrl} alt={show.name} className="w-full h-full object-cover object-top" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/50 to-transparent" />
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
                alt={show.name}
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
              <div className="flex flex-wrap gap-2">
                <span className="badge-amber">⭐ {show.vote_average?.toFixed(1)}</span>
                <span className="badge-violet">{year}</span>
                <span className="badge-cyan">TV Show</span>
                {show.status && <span className="badge-rose">{show.status}</span>}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {show.name}
              </h1>

              {show.tagline && <p className="text-slate-400 italic text-lg">"{show.tagline}"</p>}

              {show.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((g) => <span key={g.id} className="badge-violet">{g.name}</span>)}
                </div>
              )}

              <p className="text-slate-300 leading-relaxed">{show.overview}</p>

              <div className="flex flex-wrap gap-3 mt-2">
                {trailer && (
                  <button onClick={() => setIsTrailerOpen(true)} className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-lg shadow-black/20" id="watch-tv-trailer-btn">
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Watch Trailer
                  </button>
                )}
                <button
                  onClick={() => toggleWatchlist({ ...show, media_type: 'tv', name: show.name })}
                  className={`btn ${saved ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'btn-primary'}`}
                  id="tv-watchlist-toggle"
                >
                  {saved ? '✓ In Watchlist' : '+ Add to Watchlist'}
                </button>
              </div>

              {/* Season/episode info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {show.number_of_seasons > 0 && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Seasons</p>
                    <p className="text-sm font-bold text-white">{show.number_of_seasons}</p>
                  </div>
                )}
                {show.number_of_episodes > 0 && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Episodes</p>
                    <p className="text-sm font-bold text-white">{show.number_of_episodes}</p>
                  </div>
                )}
                {show.first_air_date && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">First Aired</p>
                    <p className="text-sm font-medium text-white">{formatDate(show.first_air_date)}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <section className="mt-14">
              <h2 className="section-title text-xl font-bold text-white mb-6">Cast</h2>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
                {cast.map((c) => (
                  <div
                    key={c.id}
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



          {/* Seasons */}
          {show.seasons?.length > 0 && (
            <section className="mt-14">
              <h2 className="section-title text-xl font-bold text-white mb-6">Seasons</h2>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
                {show.seasons.filter((s) => s.season_number > 0).map((season) => (
                  <div key={season.id} className="flex-shrink-0 w-[130px] glass rounded-2xl overflow-hidden">
                    <img
                      src={season.poster_path ? getImageUrl(season.poster_path, 'w185') : '/No-movie.png'}
                      alt={season.name}
                      className="w-full aspect-[2/3] object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/No-movie.png'; }}
                    />
                    <div className="p-2">
                      <p className="text-xs font-semibold text-white line-clamp-1">{season.name}</p>
                      <p className="text-[10px] text-slate-400">{season.episode_count} episodes</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section className="mt-14">
              <h2 className="section-title text-xl font-bold text-white mb-6">Recommended Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {recommendations.map((item, i) => (
                  <MediaCard key={item.id} item={item} index={i} mediaType="tv" />
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

export default TVDetail;
