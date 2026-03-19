import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from '../services/api';
import { useWatchlist } from '../hooks/useWatchlist';
import Spinner from '../components/Spinner.jsx';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isSaved = movie ? isInWatchlist(movie.id) : false;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message || 'Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };
    getMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return <div className="flex justify-center flex-col items-center mt-32"><Spinner /><p className="text-gray-400 mt-4">Loading details...</p></div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!movie) return null;

  const trailer = movie.videos?.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  
  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '';
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png';
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <div className="w-full text-white pb-20 fade-in">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="w-full h-[40vh] md:h-[60vh] relative z-0">
          <img src={backdropUrl} alt="backdrop" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 -mt-32 md:-mt-64 flex flex-col md:flex-row gap-10">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img src={posterUrl} alt={movie.title} className="w-60 md:w-80 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-gray-700" />
        </div>

        <div className="flex flex-col flex-grow mt-4 md:mt-24">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">{movie.title} <span className="text-gray-400 font-light">({releaseYear})</span></h1>
            <button 
              onClick={() => toggleWatchlist(movie)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 mt-2 rounded-full font-medium transition-all duration-300 border ${isSaved ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'}`}
            >
              <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSaved ? "0" : "2"} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-8 mt-4">
            <span className="flex items-center gap-1.5 font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/5">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-gray-500">•</span>
            <span className="font-medium">{movie.runtime} min</span>
            <span className="text-gray-500">•</span>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map(g => (
                <span key={g.id} className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-400 italic mb-6 text-lg">"{movie.tagline}"</p>

          <h3 className="text-2xl font-semibold mb-3">Overview</h3>
          <p className="text-gray-300 leading-relaxed mb-10 max-w-4xl text-lg">{movie.overview}</p>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mb-10 w-full max-w-4xl">
              <h3 className="text-2xl font-semibold mb-6">Top Cast</h3>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                {cast.map(c => (
                  <div key={c.cast_id} className="snap-start min-w-[120px] max-w-[120px] flex flex-col items-center bg-gray-800/80 rounded-2xl p-3 border border-gray-700 shadow-lg hover:bg-gray-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                     <img 
                       src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : '/no-movie.png'} 
                       alt={c.name} 
                       className="w-20 h-20 rounded-full object-cover mb-3 shadow-inner border border-gray-600" 
                     />
                     <span className="text-sm font-bold text-center text-gray-100 leading-tight mb-1">{c.name}</span>
                     <span className="text-xs text-indigo-300 text-center line-clamp-2 w-full leading-tight">{c.character}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {trailer && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-12 mb-10">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            Official Trailer
          </h3>
          <div className="aspect-w-16 aspect-h-9 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-gray-700 h-[300px] md:h-[550px]">
            <iframe 
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&controls=1&rel=0`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
