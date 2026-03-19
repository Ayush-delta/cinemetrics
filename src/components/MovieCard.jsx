import React from 'react'
import { useWatchlist } from '../hooks/useWatchlist'

const MovieCard = ({ movie, onClick }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isSaved = isInWatchlist(movie.id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <div className="movie-card cursor-pointer hover:scale-105 transition-transform duration-300 relative" onClick={() => onClick(movie)}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : "/no-movie.png"
        }
        alt={movie.title}
      />
      
      <button 
        onClick={handleWatchlistClick}
        className="absolute top-4 right-4 bg-gray-900/60 backdrop-blur-md p-2 rounded-full border border-gray-600/50 hover:bg-gray-800 transition-colors z-10 group"
      >
        <svg className={`w-5 h-5 transition-colors ${isSaved ? 'text-red-500 fill-current' : 'text-gray-300 group-hover:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSaved ? "0" : "2"} d={isSaved ? "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" : "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"} />
        </svg>
      </button>

      <div className="mt-4">
        <h3>{movie.title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star icon" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>•</span>
          <p className="lang">{movie.original_language}</p>

          <span>•</span>
          <p className="year text-white">
            {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;