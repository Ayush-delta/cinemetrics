import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/movies', label: 'Movies', icon: '🎬' },
  { to: '/tv', label: 'TV', icon: '📺' },
  { to: '/people', label: 'People', icon: '👥' },
  { to: '/watchlist', label: 'Watchlist', icon: '🔖' },
];

const MobileNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-dark border-t border-white/5">
      <ul className="flex justify-around items-center h-16">
        {LINKS.map(({ to, label, icon }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-all duration-200 ${
                  active ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[10px] font-medium">{label}</span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-violet-400 mt-0.5" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNav;
