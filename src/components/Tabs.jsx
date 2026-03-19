import React from 'react';

const TABS = ['Trending', 'Popular', 'Top Rated', 'Now Playing'];

const Tabs = ({ activeTab, setActiveTab, timeWindow, setTimeWindow }) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 border ${
              activeTab === tab 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'Trending' && (
        <div className="flex bg-gray-800 rounded-full p-1 border border-gray-700">
          <button 
            onClick={() => setTimeWindow('day')}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${timeWindow === 'day' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeWindow('week')}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${timeWindow === 'week' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            This Week
          </button>
        </div>
      )}
    </div>
  );
};

export default Tabs;
