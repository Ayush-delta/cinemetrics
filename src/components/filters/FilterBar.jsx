import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMovieGenres } from '../../api/movies';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'release_date.desc', label: 'Newest' },
  { value: 'release_date.asc', label: 'Oldest' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
];

const YEAR_OPTIONS = [
  { value: '', label: 'Any Year' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2020-2022', label: '2020–2022' },
  { value: '2010-2019', label: '2010s' },
  { value: '2000-2009', label: '2000s' },
  { value: '1990-1999', label: '1990s' },
  { value: '1980-1989', label: '1980s' },
];

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '9', label: '9+' },
  { value: '8', label: '8+' },
  { value: '7', label: '7+' },
  { value: '6', label: '6+' },
];

const RUNTIME_OPTIONS = [
  { value: '', label: 'Any Runtime' },
  { value: 'short', label: 'Under 90 min' },
  { value: 'medium', label: '90–120 min' },
  { value: 'long', label: 'Over 120 min' },
];

/**
 * @param {{
 *   filters: { genre: string, year: string, rating: string, sortBy: string, runtime: string },
 *   setFilters: (f: object) => void
 * }} props
 */
const FilterBar = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);

  const { data: genresData } = useQuery({
    queryKey: ['movie-genres'],
    queryFn: ({ signal }) => getMovieGenres(signal),
    staleTime: Infinity, // genres never change
  });

  const genres = genresData?.genres || [];

  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const activeCount = [
    filters.genre, filters.year, filters.rating, filters.runtime,
    filters.sortBy !== 'popularity.desc' ? filters.sortBy : '',
  ].filter(Boolean).length;

  const reset = () =>
    setFilters({ genre: '', year: '', rating: '', sortBy: 'popularity.desc', runtime: '' });

  return (
    <div className="mb-6">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="btn-ghost flex items-center gap-2 relative"
        id="filter-toggle"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter panel */}
      {open && (
        <div className="mt-3 glass rounded-2xl p-5 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Genre */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Genre</label>
              <select
                id="filter-genre"
                value={filters.genre}
                onChange={(e) => update('genre', e.target.value)}
                className="bg-cinema-panel border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort By</label>
              <select
                id="filter-sort"
                value={filters.sortBy}
                onChange={(e) => update('sortBy', e.target.value)}
                className="bg-cinema-panel border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Year</label>
              <select
                id="filter-year"
                value={filters.year}
                onChange={(e) => update('year', e.target.value)}
                className="bg-cinema-panel border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                {YEAR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rating</label>
              <select
                id="filter-rating"
                value={filters.rating}
                onChange={(e) => update('rating', e.target.value)}
                className="bg-cinema-panel border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                {RATING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Runtime */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Runtime</label>
              <select
                id="filter-runtime"
                value={filters.runtime}
                onChange={(e) => update('runtime', e.target.value)}
                className="bg-cinema-panel border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                {RUNTIME_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {activeCount > 0 && (
            <button onClick={reset} className="mt-4 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
              ✕ Reset all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
