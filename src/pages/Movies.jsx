import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { discoverMovies, searchMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies } from '../api/movies';
import { useSearchParams } from 'react-router-dom';
import MediaGrid from '../components/media/MediaGrid';
import Tabs from '../components/filters/Tabs';
import FilterBar from '../components/filters/FilterBar';
import SearchBar from '../components/filters/SearchBar';
import { useDebounce } from '../hooks/useDebounce';

const MOVIE_TABS = [
  { id: 'popular', label: '⭐ Popular' },
  { id: 'top_rated', label: '🏆 Top Rated' },
  { id: 'now_playing', label: '🎬 Now Playing' },
];

const DEFAULT_FILTERS = { genre: '', year: '', rating: '', sortBy: 'popularity.desc', runtime: '' };

const Movies = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [activeTab, setActiveTab] = useState('popular');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const hasFilters = filters.genre || filters.year || filters.rating || filters.runtime ||
    filters.sortBy !== 'popularity.desc';

  let gridKey, gridFn;
  if (debouncedSearch) {
    gridKey = ['search-movies', debouncedSearch];
    gridFn = ({ pageParam }) => searchMovies(debouncedSearch, pageParam);
  } else if (hasFilters) {
    gridKey = ['discover-movies', filters, activeTab];
    gridFn = ({ pageParam }) => discoverMovies({ ...filters, page: pageParam });
  } else {
    switch (activeTab) {
      case 'top_rated':
        gridKey = ['top-rated-movies'];
        gridFn = ({ pageParam }) => getTopRatedMovies(pageParam);
        break;
      case 'now_playing':
        gridKey = ['now-playing-movies'];
        gridFn = ({ pageParam }) => getNowPlayingMovies(pageParam);
        break;
      default:
        gridKey = ['popular-movies'];
        gridFn = ({ pageParam }) => getPopularMovies(pageParam);
    }
  }

  return (
    <>
      <Helmet>
        <title>Movies — CineMetrics</title>
        <meta name="description" content="Browse popular, top-rated, and now-playing movies. Filter by genre, year, and rating." />
      </Helmet>

      <main className="wrapper py-8 page-enter">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Movies</h1>
          <p className="text-slate-400 text-sm">Browse and discover great films</p>
        </div>

        <div className="mb-6">
          <SearchBar placeholder="Search movies..." />
        </div>

        {!debouncedSearch && (
          <>
            <div className="mb-5">
              <Tabs tabs={MOVIE_TABS} activeTab={activeTab} onChange={(t) => { setActiveTab(t); setFilters(DEFAULT_FILTERS); }} />
            </div>
            <FilterBar filters={filters} setFilters={setFilters} />
          </>
        )}

        <h2 className="section-title text-lg font-bold text-white mb-6">
          {debouncedSearch
            ? `Search: "${debouncedSearch}"`
            : MOVIE_TABS.find((t) => t.id === activeTab)?.label}
        </h2>

        <MediaGrid
          key={JSON.stringify(gridKey)}
          queryKey={gridKey}
          queryFn={gridFn}
          mediaType="movie"
        />
      </main>
    </>
  );
};

export default Movies;
