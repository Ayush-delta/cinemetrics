const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Base fetch wrapper for TMDB API.
 * @param {string} endpoint - Path after /3 (e.g. "/movie/popular")
 * @param {Record<string, string|number>} [params] - Query params
 * @param {AbortSignal} [signal]
 * @returns {Promise<any>}
 */
export async function tmdbFetch(endpoint, params = {}, signal) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    signal,
  });

  if (!response.ok) {
    const err = new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
}
