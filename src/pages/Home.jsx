import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { fetchMovies, fetchTrending, fetchPopular, fetchTopRated, fetchNowPlaying } from '../services/api';
import Search from '../components/search.jsx';
import Spinner from '../components/Spinner.jsx';
import MovieCard from '../components/MovieCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Tabs from '../components/Tabs.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [activeTab, setActiveTab] = useState('Trending');
  const [timeWindow, setTimeWindow] = useState('day');
  
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const loadMovies = useCallback(async (isLoadMore = false) => {
    const currentPage = isLoadMore ? page + 1 : 1;
    if (!isLoadMore) {
      setIsLoading(true);
      setPage(1);
      setMovies([]);
    } else {
      setIsLoadingMore(true);
    }
    setError('');

    try {
      let data;
      const abortController = new AbortController();
      const hasFilters = filters.genre || filters.year || filters.rating;

      if (debouncedSearchTerm) {
        data = await fetchMovies(debouncedSearchTerm, currentPage, {}, abortController.signal);
      } else if (hasFilters) {
        data = await fetchMovies('', currentPage, filters, abortController.signal);
      } else {
        switch (activeTab) {
          case 'Trending':
            data = await fetchTrending(timeWindow);
            setHasMore(false);
            break;
          case 'Popular':
            data = await fetchPopular(currentPage);
            setHasMore(data.page < data.total_pages);
            break;
          case 'Top Rated':
            data = await fetchTopRated(currentPage);
            setHasMore(data.page < data.total_pages);
            break;
          case 'Now Playing':
            data = await fetchNowPlaying(currentPage);
            setHasMore(data.page < data.total_pages);
            break;
          default:
            data = await fetchPopular(currentPage);
        }
      }

      if (data && data.results) {
        if (isLoadMore) {
          setMovies(prev => [...prev, ...data.results]);
          setPage(currentPage);
        } else {
          setMovies(data.results);
          if (activeTab === 'Trending' && !hasFilters && !debouncedSearchTerm) {
            setHasMore(false);
          } else {
            setHasMore(data.page < data.total_pages);
          }
        }
      } else {
        if (!isLoadMore) setMovies([]);
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Failed to fetch movies');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [debouncedSearchTerm, activeTab, timeWindow, filters, page]);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchCurrentState = async () => {
      setIsLoading(true);
      setError('');
      setPage(1);
      
      try {
        let data;
        const hasFilters = filters.genre || filters.year || filters.rating;

        if (debouncedSearchTerm) {
          data = await fetchMovies(debouncedSearchTerm, 1, {}, abortController.signal);
        } else if (hasFilters) {
          data = await fetchMovies('', 1, filters, abortController.signal);
        } else {
          switch (activeTab) {
            case 'Trending':
              data = await fetchTrending(timeWindow);
              break;
            case 'Popular':
              data = await fetchPopular(1);
              break;
            case 'Top Rated':
              data = await fetchTopRated(1);
              break;
            case 'Now Playing':
              data = await fetchNowPlaying(1);
              break;
            default:
              data = await fetchPopular(1);
          }
        }

        if (data && data.results) {
          setMovies(data.results);
          if (activeTab === 'Trending' && !hasFilters && !debouncedSearchTerm) {
            setHasMore(false);
          } else {
            setHasMore(data.page < data.total_pages);
          }
        } else {
          setMovies([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch movies');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentState();

    return () => {
      abortController.abort();
    };
  }, [debouncedSearchTerm, activeTab, timeWindow, filters]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const isSearchOrFilter = debouncedSearchTerm || filters.genre || filters.year || filters.rating;

  return (
    <div className="w-full flex flex-col items-center">
      <header className="w-full text-center mt-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
          Find <span className="text-white">Movies</span> You'll Enjoy Without the Hassle
        </h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      <div className="w-full max-w-6xl mt-8 px-4">
        {!debouncedSearchTerm && (
          <>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} timeWindow={timeWindow} setTimeWindow={setTimeWindow} />
            <FilterBar filters={filters} setFilters={setFilters} />
          </>
        )}

        {isSearchOrFilter && !isLoading && movies.length > 0 && (
          <h2 className="text-2xl font-bold text-white mb-6">
            {debouncedSearchTerm ? `Search Results for "${debouncedSearchTerm}"` : 'Filtered Results'}
          </h2>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-lg">{error}</p>
            <button 
              onClick={() => loadMovies(false)}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors font-medium border border-red-400"
            >
              Retry
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-2xl text-gray-300 font-medium mb-2">No movies found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))}
          </ul>
        )}

        {movies.length > 0 && !isLoading && hasMore && (
          <div className="flex justify-center mt-12 mb-8">
            {isLoadingMore ? (
              <Spinner />
            ) : (
              <button
                onClick={() => loadMovies(true)}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-300 active:scale-95 border border-indigo-400"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
