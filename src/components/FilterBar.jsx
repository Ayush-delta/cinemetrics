import React, { useState, useEffect } from 'react';
import { fetchGenres } from '../services/api';

const FilterBar = ({ filters, setFilters }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres().then(data => setGenres(data.genres || [])).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-light-100/5 backdrop-blur-md rounded-2xl border border-white/10 justify-center items-center shadow-lg">
      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1 ml-1">Genre</label>
        <select name="genre" value={filters.genre} onChange={handleChange} className="bg-dark-100 text-gray-200 p-2.5 rounded-xl outline-none border border-gray-700 focus:border-indigo-500 transition-colors cursor-pointer min-w-[140px]">
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1 ml-1">Release Year</label>
        <select name="year" value={filters.year} onChange={handleChange} className="bg-dark-100 text-gray-200 p-2.5 rounded-xl outline-none border border-gray-700 focus:border-indigo-500 transition-colors cursor-pointer min-w-[140px]">
          <option value="">All Years</option>
          <option value="2020-2029">2020s</option>
          <option value="2010-2019">2010s</option>
          <option value="2000-2009">2000s</option>
          <option value="1990-1999">1990s</option>
          <option value="1980-1989">1980s</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1 ml-1">Rating</label>
        <select name="rating" value={filters.rating} onChange={handleChange} className="bg-dark-100 text-gray-200 p-2.5 rounded-xl outline-none border border-gray-700 focus:border-indigo-500 transition-colors cursor-pointer min-w-[140px]">
          <option value="">Any Rating</option>
          <option value="8">8+ ⭐</option>
          <option value="7">7+ ⭐</option>
          <option value="6">6+ ⭐</option>
          <option value="5">5+ ⭐</option>
        </select>
      </div>
      
      {(filters.genre || filters.year || filters.rating) && (
        <button 
          onClick={() => setFilters({ genre: '', year: '', rating: '' })}
          className="mt-5 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
