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
        {/* Now in Cinemas Teaser */}
      <section className="wrapper mb-16 sm:mb-24">
        <div className="relative rounded-3xl overflow-hidden glass-dark border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at right, rgba(124, 58, 237, 0.4), transparent 50%)' }} />
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Now in Cinemas
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Experience the Magic on the Big Screen</h2>
            <p className="text-slate-300 text-lg mb-8">
              Find showtimes, book tickets, and experience the latest blockbusters in IMAX and Dolby Cinema near you.
            </p>
            <button className="btn bg-white text-black hover:bg-slate-200 border-none font-bold px-8 py-3 text-lg transition-transform hover:scale-105">
              Find Theaters Near Me
            </button>
          </div>
          <div className="relative z-10 w-full md:w-1/2 max-w-md aspect-video rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer">
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
               <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
               <div className="w-16 h-16 rounded-full bg-red-500/90 text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
               </div>
            </div>
          </div>
        </div>
      </section>

    </main>
    </>
  );
};

export default Home;
