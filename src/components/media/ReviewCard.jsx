import React, { useState } from 'react';
import { getImageUrl } from '../../lib/utils';

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const avatarPath = review.author_details?.avatar_path;
  let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=333&color=fff&size=100`;
  
  if (avatarPath) {
    if (avatarPath.startsWith('/')) {
      avatarUrl = getImageUrl(avatarPath, 'w185');
    } else {
      // Sometimes TMDB returns a full URL in avatar_path starting with a slash, we need to handle it.
      avatarUrl = avatarPath.startsWith('/https') ? avatarPath.substring(1) : avatarPath;
    }
  }

  const rating = review.author_details?.rating;
  const isLong = review.content.length > 300;
  const displayContent = expanded ? review.content : review.content.slice(0, 300) + (isLong ? '...' : '');

  return (
    <div className="glass p-5 rounded-2xl border border-white/5">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatarUrl}
          alt={review.author}
          className="w-12 h-12 rounded-full object-cover border border-white/10 bg-cinema-card"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=333&color=fff&size=100`; }}
        />
        <div>
          <h4 className="font-bold text-white text-sm">{review.author}</h4>
          {rating ? (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-slate-300 font-semibold">{rating}/10</span>
            </div>
          ) : (
             <span className="text-xs text-slate-400">No rating</span>
          )}
        </div>
      </div>
      <div className="text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap">
        {displayContent}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-violet-400 text-xs font-semibold hover:text-violet-300 transition-colors"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
