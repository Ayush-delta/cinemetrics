import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | CineMetrics</title>
      </Helmet>

      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 page-enter">
        {/* Big 404 */}
        <div className="text-[10rem] font-extrabold leading-none font-bebas"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(124,58,237,0.4))',
          }}
        >
          404
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Scene not found</h1>
        <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
          Looks like this page took a wrong turn at the movie lot. Let's get you back to the main feature.
        </p>

        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost" id="go-back">
            ← Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn-primary" id="go-home">
            🏠 Go Home
          </button>
        </div>
      </main>
    </>
  );
};

export default NotFound;
