const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

export const fetchMovies = async (query = '', pageNumber = 1, filters = { genre: '', year: '', rating: '' }, abortSignal) => {
  let endpoint = '';
  
  if (query) {
    endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNumber}`;
  } else {
    endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNumber}`;
    if (filters.genre) endpoint += `&with_genres=${filters.genre}`;
    if (filters.year) {
      const startYear = filters.year.split('-')[0];
      const endYear = filters.year.split('-')[1];
      if (endYear) {
        endpoint += `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
      } else {
        endpoint += `&primary_release_year=${startYear}`;
      }
    }
    if (filters.rating) endpoint += `&vote_average.gte=${filters.rating}&vote_count.gte=50`;
  }

  const response = await fetch(endpoint, { ...API_OPTIONS, signal: abortSignal });
  if (!response.ok) throw new Error('Failed to fetch movies');
  const data = await response.json();
  if (data.Response === "False") throw new Error(data.error || 'Failed to fetch movies');
  return data;
};

export const fetchTrending = async (timeWindow = 'day') => {
  const response = await fetch(`${API_BASE_URL}/trending/movie/${timeWindow}`, API_OPTIONS);
  if (!response.ok) throw new Error('Failed to fetch trending movies');
  return response.json();
};

export const fetchPopular = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/movie/popular?page=${page}`, API_OPTIONS);
  if (!response.ok) throw new Error('Failed to fetch popular movies');
  return response.json();
};

export const fetchTopRated = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/movie/top_rated?page=${page}`, API_OPTIONS);
  if (!response.ok) throw new Error('Failed to fetch top rated movies');
  return response.json();
};

export const fetchNowPlaying = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/movie/now_playing?page=${page}`, API_OPTIONS);
  if (!response.ok) throw new Error('Failed to fetch now playing movies');
  return response.json();
};

export const fetchMovieDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/movie/${id}?append_to_response=videos,credits`, API_OPTIONS);
  if (!response.ok) throw new Error('Failed to fetch movie details');
  return response.json();
};

export const fetchGenres = async () => {
  const response = await fetch(`${API_BASE_URL}/genre/movie/list`, API_OPTIONS);
  if (!response.ok) throw new Error('Failed to fetch genres');
  return response.json();
};
