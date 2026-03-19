import React from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import MovieCard from '../components/MovieCard.jsx';
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <header className="w-full text-center mt-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
          Your <span className="text-white">Watchlist</span>
        </h1>
      </header>

      <div className="w-full max-w-6xl mt-8 px-4">
        {watchlist.length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            <h3 className="text-2xl text-gray-300 font-medium mb-2">Your watchlist is empty</h3>
            <p className="text-gray-500">Go find some great movies and save them here!</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 active:scale-95"
            >
              Discover Movies
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
