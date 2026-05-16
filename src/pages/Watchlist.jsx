import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useWatchlist, WATCHLIST_CATEGORIES } from '../context/WatchlistContext';
import { getImageUrl, getTitle, getYear } from '../lib/utils';

const TABS = Object.entries(WATCHLIST_CATEGORIES).map(([id, label]) => ({ id, label }));
const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date Added (Newest)' },
  { value: 'date_asc', label: 'Date Added (Oldest)' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'rating_desc', label: 'Rating ↓' },
];

const STAR_RATINGS = [1, 2, 3, 4, 5];

const Watchlist = () => {
  const { watchlist, moveCategory, updateItem, removeFromWatchlist, exportWatchlist, importWatchlist } =
    useWatchlist();
  const [activeCategory, setActiveCategory] = useState('plan');
  const [sortBy, setSortBy] = useState('date_desc');
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const filtered = watchlist
    .filter((item) => item._category === activeCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':  return a._addedAt - b._addedAt;
        case 'title_asc': return getTitle(a).localeCompare(getTitle(b));
        case 'rating_desc': return (b._rating || 0) - (a._rating || 0);
        default:          return b._addedAt - a._addedAt;
      }
    });

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => importWatchlist(ev.target.result);
    reader.readAsText(file);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setNoteText(item._notes || '');
  };

  const saveNote = (id) => {
    updateItem(id, { _notes: noteText });
    setEditingId(null);
  };

  return (
    <>
      <Helmet>
        <title>My Watchlist — CineMetrics</title>
        <meta name="description" content="Manage your personal movie and TV watchlist with categories, ratings, and notes." />
      </Helmet>

      <main className="wrapper py-8 page-enter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">My Watchlist</h1>
            <p className="text-slate-400 text-sm">{watchlist.length} items saved</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportWatchlist} className="btn-ghost text-sm" id="export-watchlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm" id="import-watchlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Import
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>

        {/* Category tabs */}
        <div className="tab-bar mb-6 w-fit">
          {TABS.map(({ id, label }) => {
            const count = watchlist.filter((i) => i._category === id).length;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`tab-item flex items-center gap-2 ${activeCategory === id ? 'active' : ''}`}
                id={`watchlist-tab-${id}`}
              >
                {label}
                {count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-violet-600/40 text-violet-300 text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 mb-6">
          <label className="text-xs text-slate-400 font-medium">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="watchlist-sort"
            className="bg-cinema-panel border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="text-6xl">🎬</div>
            <h2 className="text-xl font-semibold text-white">
              No movies in "{WATCHLIST_CATEGORIES[activeCategory]}"
            </h2>
            <p className="text-slate-400 text-center">
              Start exploring and add movies to your watchlist!
            </p>
            <button onClick={() => navigate('/')} className="btn-primary" id="go-discover">
              Discover Movies
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const type = item.media_type || (item.title ? 'movie' : 'tv');
              return (
                <div
                  key={item.id}
                  className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4 hover:border-violet-500/30 border border-transparent transition-colors"
                >
                  {/* Poster */}
                  <div
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/${type}/${item.id}`)}
                    role="button"
                    aria-label={getTitle(item)}
                  >
                    <img
                      src={getImageUrl(item.poster_path, 'w185')}
                      alt={getTitle(item)}
                      className="w-16 sm:w-20 rounded-xl shadow-lg"
                      onError={(e) => { e.target.src = '/no-movie.png'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3
                          className="font-semibold text-white hover:text-violet-300 cursor-pointer transition-colors text-base leading-tight"
                          onClick={() => navigate(`/${type}/${item.id}`)}
                        >
                          {getTitle(item)}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {getYear(item.release_date || item.first_air_date)}
                          {item.vote_average ? ` · ⭐ ${item.vote_average.toFixed(1)}` : ''}
                        </p>
                      </div>

                      {/* Move category */}
                      <select
                        value={item._category}
                        onChange={(e) => moveCategory(item.id, e.target.value)}
                        className="bg-cinema-panel border border-white/10 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-violet-500 flex-shrink-0"
                        aria-label="Move to category"
                      >
                        {TABS.map(({ id, label }) => (
                          <option key={id} value={id}>{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Star rating */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 mr-1">My Rating:</span>
                      {STAR_RATINGS.map((star) => (
                        <button
                          key={star}
                          onClick={() => updateItem(item.id, { _rating: item._rating === star ? null : star })}
                          className={`text-lg transition-colors ${star <= (item._rating || 0) ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`}
                          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    {/* Notes */}
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add your notes..."
                          className="flex-1 bg-cinema-navy border border-violet-500/30 text-white text-sm rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-violet-500"
                          rows={2}
                        />
                        <div className="flex flex-col gap-1">
                          <button onClick={() => saveNote(item.id)} className="btn-primary text-xs px-3 py-1.5">Save</button>
                          <button onClick={() => setEditingId(null)} className="btn-ghost text-xs px-3 py-1.5">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="text-left text-xs text-slate-400 hover:text-violet-300 transition-colors"
                      >
                        {item._notes ? `📝 ${item._notes}` : '+ Add note'}
                      </button>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="flex-shrink-0 btn-icon self-start text-slate-500 hover:text-red-400 hover:border-red-400/30"
                    aria-label="Remove from watchlist"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default Watchlist;
