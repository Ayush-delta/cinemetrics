import { tmdbFetch } from './client';

/** @param {number} page */
export const getPopularPeople = (page = 1, signal) =>
  tmdbFetch('/person/popular', { page }, signal);

/** @param {number|string} id */
export const getPersonDetails = (id, signal) =>
  tmdbFetch(`/person/${id}`, { append_to_response: 'movie_credits,tv_credits,images' }, signal);

/** @param {string} query */
export const searchPeople = (query, page = 1, signal) =>
  tmdbFetch('/search/person', { query, page, include_adult: false }, signal);

/**
 * Multi-search: movies + TV + people.
 * @param {string} query
 */
export const multiSearch = (query, page = 1, signal) =>
  tmdbFetch('/search/multi', { query, page, include_adult: false }, signal);
