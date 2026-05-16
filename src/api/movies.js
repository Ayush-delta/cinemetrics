import { tmdbFetch } from './client';

// ─── Trending ────────────────────────────────────────────────────────────────

/** @param {'day'|'week'} timeWindow */
export const getTrendingMovies = (timeWindow = 'week', page = 1, signal) =>
  tmdbFetch(`/trending/movie/${timeWindow}`, { page }, signal);

// ─── Discovery / Lists ───────────────────────────────────────────────────────

/** @param {number} page */
export const getPopularMovies = (page = 1, signal) =>
  tmdbFetch('/movie/popular', { page }, signal);

/** @param {number} page */
export const getTopRatedMovies = (page = 1, signal) =>
  tmdbFetch('/movie/top_rated', { page }, signal);

/** @param {number} page */
export const getNowPlayingMovies = (page = 1, signal) =>
  tmdbFetch('/movie/now_playing', { page }, signal);

/**
 * Discover movies with optional filters.
 * @param {{ page?: number, genre?: string, year?: string, rating?: string, sortBy?: string, runtime?: string }} opts
 */
export const discoverMovies = (
  { page = 1, genre = '', year = '', rating = '', sortBy = 'popularity.desc', runtime = '' } = {},
  signal,
) => {
  const params = { page, sort_by: sortBy };

  if (genre) params.with_genres = genre;
  if (rating) {
    params['vote_average.gte'] = rating;
    params['vote_count.gte'] = 50;
  }
  if (year) {
    const [startYear, endYear] = year.split('-');
    if (endYear) {
      params['primary_release_date.gte'] = `${startYear}-01-01`;
      params['primary_release_date.lte'] = `${endYear}-12-31`;
    } else {
      params.primary_release_year = startYear;
    }
  }
  if (runtime === 'short') params['with_runtime.lte'] = 90;
  else if (runtime === 'medium') {
    params['with_runtime.gte'] = 90;
    params['with_runtime.lte'] = 120;
  } else if (runtime === 'long') params['with_runtime.gte'] = 120;

  return tmdbFetch('/discover/movie', params, signal);
};

// ─── Search ──────────────────────────────────────────────────────────────────

/**
 * @param {string} query
 * @param {number} page
 */
export const searchMovies = (query, page = 1, signal) =>
  tmdbFetch('/search/movie', { query, page, include_adult: false }, signal);

// ─── Details ─────────────────────────────────────────────────────────────────

/** @param {number|string} id */
export const getMovieDetails = (id, signal) =>
  tmdbFetch(`/movie/${id}`, { append_to_response: 'videos,credits,recommendations,similar,images' }, signal);

/** @param {number|string} id */
export const getMovieRecommendations = (id, page = 1, signal) =>
  tmdbFetch(`/movie/${id}/recommendations`, { page }, signal);

// ─── Genres ──────────────────────────────────────────────────────────────────

export const getMovieGenres = (signal) =>
  tmdbFetch('/genre/movie/list', {}, signal);
