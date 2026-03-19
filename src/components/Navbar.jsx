import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 relative z-50">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="CineMetrics Logo" className="w-10 h-10 object-contain drop-shadow-md hover:scale-110 transition-transform duration-300" />
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
          CineMetrics
        </span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className={`text-lg font-medium transition-colors hover:text-indigo-400 ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}
        >
          Home
        </Link>
        <Link 
          to="/watchlist" 
          className={`text-lg font-medium transition-colors hover:text-indigo-400 ${location.pathname === '/watchlist' ? 'text-white' : 'text-gray-400'}`}
        >
          Watchlist
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
