import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPopularTV, getTopRatedTV, getTrendingTV, getAiringTodayTV } from '../api/tv';
import MediaGrid from '../components/media/MediaGrid';
import Tabs from '../components/filters/Tabs';

const TV_TABS = [
  { id: 'trending', label: '🔥 Trending' },
  { id: 'popular', label: '⭐ Popular' },
  { id: 'top_rated', label: '🏆 Top Rated' },
  { id: 'airing_today', label: '📡 Airing Today' },
];

const TVShows = () => {
  const [activeTab, setActiveTab] = useState('trending');

  let gridKey, gridFn;
  switch (activeTab) {
    case 'trending':
      gridKey = ['trending-tv', 'week'];
      gridFn = ({ pageParam }) => getTrendingTV('week', pageParam);
      break;
    case 'top_rated':
      gridKey = ['top-rated-tv'];
      gridFn = ({ pageParam }) => getTopRatedTV(pageParam);
      break;
    case 'airing_today':
      gridKey = ['airing-today-tv'];
      gridFn = ({ pageParam }) => getAiringTodayTV(pageParam);
      break;
    default:
      gridKey = ['popular-tv'];
      gridFn = ({ pageParam }) => getPopularTV(pageParam);
  }

  return (
    <>
      <Helmet>
        <title>TV Shows — CineMetrics</title>
        <meta name="description" content="Discover trending, popular, and top-rated TV shows. Find what's airing today." />
      </Helmet>

      <main className="wrapper py-8 page-enter">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">TV Shows</h1>
          <p className="text-slate-400 text-sm">From trending series to timeless classics</p>
        </div>

        <div className="mb-6">
          <Tabs tabs={TV_TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <h2 className="section-title text-lg font-bold text-white mb-6">
          {TV_TABS.find((t) => t.id === activeTab)?.label}
        </h2>

        <MediaGrid
          key={gridKey.join('-')}
          queryKey={gridKey}
          queryFn={gridFn}
          mediaType="tv"
          emptyMessage="No TV shows found."
        />
      </main>
    </>
  );
};

export default TVShows;
