import { useEffect, useState} from 'react';
import Search from './components/search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce} from "react-use";
import { updateSearchCount } from './appwrite.js';
//define API base URL and options
const API_BASE_URL = 'https://api.themoviedb.org/3';
//get API key from environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

// debounce the search term to prevent making too many API calls
// waiting for the user to stop typing for 500 milliseconds
  useDebounce( () =>
    setDebouncedSearchTerm(searchTerm)
, 500 ,[searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.Response === "False") {
        setErrorMessage(data.error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results|| []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch(error) {
      console.error (`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally{
      setIsLoading(false);
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      setIsLoading(true);
      const movies = await fetch(
        `${API_BASE_URL}/trending/movie/week`,
        API_OPTIONS
      );

      if (movies.ok) {
        const data = await movies.json();

        const mapped = (data.results || []).map(m => ({
        ...m,
        poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '/no-movie.png'
      }));
        console.log('TMDB Trending:', data);
        setTrendingMovies(mapped);
      }
    } catch (error) {
      console.error('Error fetching trending:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt = "Hero Banner"/>
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

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
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App