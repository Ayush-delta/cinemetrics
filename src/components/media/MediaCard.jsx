import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl, getTitle, getYear } from '../../lib/utils';
import { useWatchlist } from '../../context/WatchlistContext';

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: 'easeOut' },
  }),
};

/**
 * Universal media card for movies and TV shows.
 * @param {{ item: object, index?: number, mediaType?: 'movie'|'tv' }} props
 */
const MediaCard = ({ item, index = 0, mediaType }) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  if (!item) return null;

  const type = mediaType || (item.title ? 'movie' : 'tv');
  const title = getTitle(item);
  const year = getYear(item.release_date || item.first_air_date);
  const rating = item.vote_average?.toFixed(1) || 'N/A';
  const posterUrl = getImageUrl(item.poster_path, 'w342');
  const saved = isInWatchlist(item.id);

  const handleClick = () => navigate(`/${type}/${item.id}`);
  const handleWatchlist = (e) => {
    e.stopPropagation();
    toggleWatchlist({ ...item, media_type: type });
  };

  return (
    <motion.div
      custom={index}
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      className="media-card group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={title}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { e.target.src = '/no-movie.png'; }}
        />

        {/* Overlay */}
        <div className="media-card-overlay">
          <div className="flex items-center justify-between">
            <span className="badge-amber text-xs">
              ⭐ {rating}
            </span>
            <span className="text-xs text-slate-300 font-medium">{year}</span>
          </div>
        </div>

        {/* Watchlist button */}
        <button
          onClick={handleWatchlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${
            saved
              ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]'
              : 'bg-black/50 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:text-white'
          }`}
          aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {saved ? (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-1 leading-snug">{title}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs text-yellow-400 font-bold">★ {rating}</span>
          <span className="text-slate-600 text-xs">•</span>
          <span className="text-xs text-slate-400">{year}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaCard;
