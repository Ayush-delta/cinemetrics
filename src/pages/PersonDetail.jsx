import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getPersonDetails } from '../api/people';
import { getImageUrl, formatDate } from '../lib/utils';
import MediaCard from '../components/media/MediaCard';
import Spinner from '../components/ui/Spinner';

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: person, isLoading, isError, error } = useQuery({
    queryKey: ['person-detail', id],
    queryFn: ({ signal }) => getPersonDetails(id, signal),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Loading person..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg">{error?.message || 'Failed to load person.'}</p>
        <button className="btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  if (!person) return null;

  const profileUrl = getImageUrl(person.profile_path, 'h632');
  
  // Get credits and sort by popularity or release date
  const rawMovieCredits = person.movie_credits?.cast || [];
  const rawTvCredits = person.tv_credits?.cast || [];
  
  // Combine and sort top credits (prioritizing popularity)
  const allCredits = [
    ...rawMovieCredits.map(c => ({ ...c, media_type: 'movie' })),
    ...rawTvCredits.map(c => ({ ...c, media_type: 'tv' }))
  ].sort((a, b) => b.popularity - a.popularity);
  
  const topCredits = allCredits.slice(0, 12);

  return (
    <>
      <Helmet>
        <title>{person.name} — CineMetrics</title>
        <meta name="description" content={person.biography?.slice(0, 160) || `Learn about ${person.name}.`} />
        <meta property="og:title" content={person.name} />
        <meta property="og:image" content={profileUrl} />
      </Helmet>

      <article className="text-white pb-24 animate-fade-in wrapper pt-8">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-8"
          aria-label="Go back"
        >
          ← Back
        </button>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 relative z-10">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-72 lg:w-80"
          >
            <img
              src={person.profile_path ? profileUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=333&color=fff&size=400`}
              alt={person.name}
              className="w-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 object-cover object-center aspect-[2/3]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=333&color=fff&size=400`;
              }}
            />

            {/* Personal Info */}
            <div className="mt-8 flex flex-col gap-4">
              <h3 className="text-lg font-bold">Personal Info</h3>
              
              {person.known_for_department && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Known For</p>
                  <p className="text-sm">{person.known_for_department}</p>
                </div>
              )}
              
              {person.gender > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Gender</p>
                  <p className="text-sm">{person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Non-binary'}</p>
                </div>
              )}
              
              {person.birthday && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Birthday</p>
                  <p className="text-sm">
                    {formatDate(person.birthday)} 
                    {!person.deathday && ` (${new Date().getFullYear() - new Date(person.birthday).getFullYear()} years old)`}
                  </p>
                </div>
              )}
              
              {person.deathday && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Day of Death</p>
                  <p className="text-sm">{formatDate(person.deathday)}</p>
                </div>
              )}
              
              {person.place_of_birth && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Place of Birth</p>
                  <p className="text-sm">{person.place_of_birth}</p>
                </div>
              )}
              
              {person.also_known_as?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Also Known As</p>
                  <div className="flex flex-col gap-1 mt-1">
                    {person.also_known_as.slice(0, 5).map((name, i) => (
                      <p key={i} className="text-sm">{name}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6 flex-1 min-w-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              {person.name}
            </h1>

            {/* Biography */}
            <div>
              <h2 className="text-xl font-bold mb-3">Biography</h2>
              {person.biography ? (
                <div className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  {person.biography}
                </div>
              ) : (
                <p className="text-slate-400 italic">We don't have a biography for {person.name}.</p>
              )}
            </div>

            {/* Known For Grid */}
            {topCredits.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-white mb-6">Known For</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {topCredits.map((item, i) => (
                    <MediaCard key={`${item.id}-${item.media_type}`} item={item} index={i} mediaType={item.media_type} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </article>
    </>
  );
};

export default PersonDetail;
