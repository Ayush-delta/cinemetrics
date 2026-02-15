import { useEffect, useState } from 'react';
import Search from './components/search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import SkeletonCard from './components/SkeletonCard.jsx';
import { useDebounce } from "react-use";
import { updateSearchCount } from './appwrite.js';
//define API base URL and options
const API_BASE_URL = 'https://api.themoviedb.org/3';
//get API key from environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // debounce the search term to prevent making too many API calls
  // waiting for the user to stop typing for 500 milliseconds
  useDebounce(() =>
    setDebouncedSearchTerm(searchTerm)
    , 500, [searchTerm]);

  const fetchMovies = async (query = '', pageNumber = 1) => {
    if (pageNumber === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setErrorMessage('');

    try {
      const endpoint = query ?
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNumber}` :
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNumber}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      if (pageNumber === 1) {
        setMovieList(data.results || []);
      } else {
        setMovieList((prev) => [...prev, ...(data.results || [])]);
      }

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      setIsTrendingLoading(true);
      const movies = await fetch(
        `${API_BASE_URL}/trending/movie/week`,
        API_OPTIONS
      );

      if (movies.ok) {
        const data = await movies.json();

        const mapped = (data.results || []).slice(0, 5).map((m) => ({
          ...m,
          poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '/no-movie.png'
        }));
        console.log('TMDB Trending:', data);
        setTrendingMovies(mapped);
      }
    } catch (error) {
      console.error('Error fetching trending:', error);
    } finally {
      setIsTrendingLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  const loadMoreMovies = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(debouncedSearchTerm, nextPage);
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);



  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          {trendingMovies.length > 0 ? (
            <div className="flex justify-center items-center mb-10 h-[300px] relative">
              {/* Left Card - Movie #2 */}
              {trendingMovies[1] && (
                <img
                  src={trendingMovies[1].poster_url}
                  alt={trendingMovies[1].title}
                  className="hero-img -rotate-6 sm:-rotate-12 translate-x-4 sm:translate-x-8 z-0 opacity-70 hover:opacity-100 transition-all duration-500"
                />
              )}
              {/* Center Card - Movie #1 */}
              {trendingMovies[0] && (
                <img
                  src={trendingMovies[0].poster_url}
                  alt={trendingMovies[0].title}
                  className="hero-img z-10 scale-110 sm:scale-125 shadow-[0_0_30px_rgba(255,255,255,0.3)] mx-[-10px] sm:mx-[-20px] border-2 border-white/10 hover:scale-125 sm:hover:scale-135 transition-all duration-500"
                />
              )}
              {/* Right Card - Movie #3 */}
              {trendingMovies[2] && (
                <img
                  src={trendingMovies[2].poster_url}
                  alt={trendingMovies[2].title}
                  className="hero-img rotate-6 sm:rotate-12 -translate-x-4 sm:-translate-x-8 z-0 opacity-70 hover:opacity-100 transition-all duration-500"
                />
              )}
            </div>
          ) : isTrendingLoading ? (
            // Loading state (placeholder to prevent layout shift)
            <div className="w-full max-w-lg h-[300px] mx-auto flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <img src="./hero.png" alt="Hero Banner" className="w-full max-w-lg h-auto object-contain mx-auto drop-shadow-md" />
          )}
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <h1 className='text-white'>{searchTerm}</h1>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>

          {isLoading ? (
            <ul>
              {Array.from({ length: 12 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </ul>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
              ))}
            </ul>
          )}

          {movieList.length > 0 && !isLoading && !errorMessage && (
            <div className="flex justify-center mt-8">
              {isLoadingMore ? (
                <Spinner />
              ) : (
                <button
                  onClick={loadMoreMovies}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg hover:scale-105 active:scale-95"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </section>
      </div>
      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </main>
  )
}

export default App;