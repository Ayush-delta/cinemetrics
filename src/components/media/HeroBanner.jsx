import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, getTitle, getYear } from '../../lib/utils';
import { useWatchlist } from '../../context/WatchlistContext';

/**
 * Cinematic hero banner carousel.
 * @param {{ items: Array, mediaType?: 'movie'|'tv' }} props
 */
const HeroBanner = ({ items = [], mediaType = 'movie' }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const goTo = useCallback((idx) => {
    setCurrent((idx + items.length) % items.length);
  }, [items.length]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(timer);
  }, [current, paused, items.length, goTo]);

  if (!items.length) return null;

  const item = items[current];
  const backdropUrl = getImageUrl(item.backdrop_path, 'original');
  const posterUrl = getImageUrl(item.poster_path, 'w342');
  const title = getTitle(item);
  const year = getYear(item.release_date || item.first_air_date);
  const rating = item.vote_average?.toFixed(1);
  const genres = item.genre_ids?.slice(0, 3) || [];
  const detailPath = `/${mediaType}/${item.id}`;
  const saved = isInWatchlist(item.id);

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ minHeight: '80vh', maxHeight: '90vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 wrapper flex flex-col md:flex-row items-end md:items-center gap-8 h-full" style={{ paddingTop: '15vh', paddingBottom: '10vh' }}>
        {/* Poster — hidden on mobile */}
        <motion.div
          key={`poster-${current}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden lg:block flex-shrink-0"
        >
          <img
            src={posterUrl}
            alt={title}
            className="w-52 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10"
          />
        </motion.div>

        {/* Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col gap-4 max-w-2xl"
          >
            {/* Rating + year */}
            <div className="flex items-center gap-3">
              <span className="badge-amber gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
              <span className="badge-violet">{year}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                {mediaType === 'tv' ? 'TV Show' : 'Movie'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--color-text-primary)] leading-tight">
              {title}
            </h1>

            <p className="text-[var(--color-text-secondary)] text-base leading-relaxed line-clamp-3 max-w-xl">
              {item.overview}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => navigate(detailPath)}
                className="btn-primary"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                View Details
              </button>
              <button
                onClick={() => toggleWatchlist(item)}
                className={`btn ${saved
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30'
                  : 'btn-ghost'
                }`}
              >
                {saved ? (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.slice(0, 10).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-6 h-2 bg-violet-500' : 'w-2 h-2 bg-[var(--color-text-muted)] hover:bg-[var(--color-text-primary)]'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrow navigation */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 btn-icon glass opacity-70 hover:opacity-100"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-[var(--color-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 btn-icon glass opacity-70 hover:opacity-100"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-[var(--color-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
