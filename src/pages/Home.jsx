import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  discoverMovies,
  searchMovies,
} from '../api/movies';
import HeroBanner from '../components/media/HeroBanner';
import MediaGrid from '../components/media/MediaGrid';
import MediaCard from '../components/media/MediaCard';
import Tabs from '../components/filters/Tabs';
import FilterBar from '../components/filters/FilterBar';
import SearchBar from '../components/filters/SearchBar';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useDebounce } from '../hooks/useDebounce';

const HOME_TABS = [
  { id: 'trending', label: '🔥 Trending' },
  { id: 'popular', label: '⭐ Popular' },
  { id: 'top_rated', label: '🏆 Top Rated' },
  { id: 'now_playing', label: '🎬 Now Playing' },
];

const DEFAULT_FILTERS = { genre: '', year: '', rating: '', sortBy: 'popularity.desc', runtime: '' };

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [activeTab, setActiveTab] = useState('trending');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { recentlyViewed } = useRecentlyViewed();

  // Hero: trending week
  const { data: heroData } = useQuery({
    queryKey: ['trending-movies-week'],
    queryFn: ({ signal }) => getTrendingMovies('week', 1, signal),
    staleTime: 10 * 60 * 1000,
  });
  const heroItems = heroData?.results?.slice(0, 10) || [];

  const hasFilters = filters.genre || filters.year || filters.rating || filters.runtime ||
    filters.sortBy !== 'popularity.desc';

  // Compute grid query props
  let gridKey, gridFn;

  if (debouncedSearch) {
    gridKey = ['search-movies', debouncedSearch];
    gridFn = ({ pageParam }) => searchMovies(debouncedSearch, pageParam);
  } else if (hasFilters) {
    gridKey = ['discover-movies', filters];
    gridFn = ({ pageParam }) => discoverMovies({ ...filters, page: pageParam });
  } else {
    switch (activeTab) {
      case 'trending':
        gridKey = ['trending-movies', 'week'];
        gridFn = ({ pageParam }) => getTrendingMovies('week', pageParam);
        break;
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
        <title>CineMetrics — Discover Movies &amp; TV Shows</title>
        <meta name="description" content="Discover trending movies and TV shows, build your watchlist, and explore by genre, rating, and more." />
        <meta property="og:title" content="CineMetrics" />
        <meta property="og:description" content="Your premium movie & TV discovery platform." />
      </Helmet>

      {/* Hero banner (not during search) */}
      {!debouncedSearch && heroItems.length > 0 && (
        <HeroBanner items={heroItems} mediaType="movie" />
      )}

      <main className="wrapper py-8 page-enter">
        {/* Search bar */}
        <div className="mb-8">
          <SearchBar placeholder="Search movies, TV shows, people..." />
        </div>

        {/* Recently viewed */}
        {!debouncedSearch && recentlyViewed.length > 0 && (
          <section className="mb-10">
            <h2 className="section-title text-xl font-bold text-white mb-5">Continue Watching</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-3">
              {recentlyViewed.slice(0, 12).map((item, i) => (
                <div key={item.id} className="flex-shrink-0 w-[130px] sm:w-[150px]">
                  <MediaCard item={item} index={i} mediaType={item.title ? 'movie' : 'tv'} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabs + Filters (not during search) */}
        {!debouncedSearch && (
          <>
            <div className="mb-5">
              <Tabs tabs={HOME_TABS} activeTab={activeTab} onChange={(tab) => { setActiveTab(tab); setFilters(DEFAULT_FILTERS); }} />
            </div>
            {activeTab !== 'trending' && (
              <FilterBar filters={filters} setFilters={setFilters} />
            )}
          </>
        )}

        {/* Section title */}
        <h2 className="section-title text-xl font-bold text-white mb-6">
          {debouncedSearch
            ? `Results for "${debouncedSearch}"`
            : HOME_TABS.find((t) => t.id === activeTab)?.label || 'Discover'}
        </h2>

        {/* Grid */}
        <MediaGrid
          key={JSON.stringify(gridKey)}
          queryKey={gridKey}
          queryFn={gridFn}
          mediaType="movie"
          emptyMessage={debouncedSearch ? `No results found for "${debouncedSearch}".` : 'No movies found.'}
        />
      </main>
    </>
  );
};

export default Home;
