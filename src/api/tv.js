import { tmdbFetch } from './client';


/** @param {'day'|'week'} timeWindow */
export const getTrendingTV = (timeWindow = 'week', page = 1, signal) =>
  tmdbFetch(`/trending/tv/${timeWindow}`, { page }, signal);


export const getPopularTV = (page = 1, signal) =>
  tmdbFetch('/tv/popular', { page }, signal);

export const getTopRatedTV = (page = 1, signal) =>
  tmdbFetch('/tv/top_rated', { page }, signal);

export const getAiringTodayTV = (page = 1, signal) =>
  tmdbFetch('/tv/airing_today', { page }, signal);

export const getOnAirTV = (page = 1, signal) =>
  tmdbFetch('/tv/on_the_air', { page }, signal);


/** @param {number|string} id */
export const getTVDetails = (id, signal) =>
  tmdbFetch(`/tv/${id}`, { append_to_response: 'videos,credits,recommendations,similar,reviews' }, signal);

/** @param {number|string} id */
export const getTVSeasonDetails = (tvId, seasonNumber, signal) =>
  tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`, {}, signal);


export const searchTV = (query, page = 1, signal) =>
  tmdbFetch('/search/tv', { query, page, include_adult: false }, signal);

export const getTVGenres = (signal) =>
  tmdbFetch('/genre/tv/list', {}, signal);

// ─── Discover ────────────────────────────────────────────────────────────────

export const discoverTV = (
  { page = 1, genre = '', sortBy = 'popularity.desc' } = {},
  signal,
) => {
  const params = { page, sort_by: sortBy };
  if (genre) params.with_genres = genre;
  return tmdbFetch('/discover/tv', params, signal);
};
