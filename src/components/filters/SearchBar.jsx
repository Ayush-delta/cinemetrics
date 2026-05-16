import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '../../api/movies';
import { useDebounce } from '../../hooks/useDebounce';
import { getImageUrl, getTitle } from '../../lib/utils';

/**
 * SearchBar with URL sync + autocomplete suggestions.
 * @param {{ placeholder?: string }} props
 */
const SearchBar = ({ placeholder = 'Search movies, TV shows...' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const debouncedValue = useDebounce(inputValue, 350);

  // Suggestions query
  const { data: suggestionsData } = useQuery({
    queryKey: ['search-suggestions', debouncedValue],
    queryFn: ({ signal }) => searchMovies(debouncedValue, 1, signal),
    enabled: debouncedValue.trim().length >= 2,
    staleTime: 30_000,
  });

  const suggestions = suggestionsData?.results?.slice(0, 5) || [];

  // Sync to URL
  useEffect(() => {
    if (debouncedValue.trim()) {
      setSearchParams({ q: debouncedValue.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedValue, setSearchParams]);

  // Show/hide suggestions
  useEffect(() => {
    setShowSuggestions(inputValue.trim().length >= 2 && suggestions.length > 0);
    setSelectedIndex(-1);
  }, [inputValue, suggestions.length]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Global shortcut to focus search
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => Math.min(p + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => Math.max(p - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        const item = suggestions[selectedIndex];
        navigate(`/movie/${item.id}`);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (item) => {
    navigate(`/movie/${item.id}`);
    setShowSuggestions(false);
    setInputValue('');
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl mx-auto">
      <div className="search-input-wrap px-4 py-3">
        <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent mx-3 text-white placeholder-slate-500 outline-none text-sm"
          autoComplete="off"
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
        />
        {inputValue && (
          <button onClick={handleClear} className="text-slate-500 hover:text-white transition-colors" aria-label="Clear">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-50 border border-white/10 shadow-2xl animate-scale-in">
          <ul role="listbox">
            {suggestions.map((item, i) => (
              <li
                key={item.id}
                role="option"
                aria-selected={i === selectedIndex}
                onClick={() => handleSuggestionClick(item)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  i === selectedIndex ? 'bg-violet-600/20' : 'hover:bg-white/5'
                }`}
              >
                <img
                  src={getImageUrl(item.poster_path, 'w92')}
                  alt={getTitle(item)}
                  className="w-9 h-12 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { e.target.src = '/no-movie.png'; }}
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-white truncate">{getTitle(item)}</span>
                  <span className="text-xs text-slate-400">
                    {item.release_date?.split('-')[0] || 'N/A'}
                    {item.vote_average ? ` · ⭐ ${item.vote_average.toFixed(1)}` : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
