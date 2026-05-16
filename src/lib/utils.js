/**
 * Build a TMDB image URL.
 * @param {string|null} path - TMDB poster/backdrop path
 * @param {'w185'|'w342'|'w500'|'w780'|'original'} size
 * @returns {string}
 */
export function getImageUrl(path, size = 'w500') {
  if (!path) return '/no-movie.png';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Format runtime in minutes to "Xh Ym".
 * @param {number} minutes
 * @returns {string}
 */
export function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Format ISO date string to a readable date.
 * @param {string} dateStr - e.g. "2024-03-15"
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get the release year from an ISO date string.
 * @param {string} dateStr
 * @returns {string}
 */
export function getYear(dateStr) {
  if (!dateStr) return 'N/A';
  return dateStr.split('-')[0];
}

/**
 * Merge class names (utility).
 * @param {...string} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get a title from a media item (works for both movies and TV).
 * @param {{ title?: string, name?: string }} item
 * @returns {string}
 */
export function getTitle(item) {
  return item?.title || item?.name || 'Untitled';
}

/**
 * Get a release date from a media item (works for both movies and TV).
 * @param {{ release_date?: string, first_air_date?: string }} item
 * @returns {string}
 */
export function getReleaseDate(item) {
  return item?.release_date || item?.first_air_date || '';
}
