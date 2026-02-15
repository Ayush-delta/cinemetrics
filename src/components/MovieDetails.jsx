import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

const MovieDetails = ({ movie, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/movie/${movie.id}?append_to_response=credits,videos`,
                    API_OPTIONS
                );
                const data = await response.json();
                setDetails(data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (movie) fetchDetails();
    }, [movie]);

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f0d23] rounded-3xl shadow-2xl border border-gray-800 scrollbar-hide">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-white/20 transition-colors text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div>
                        {/* Backdrop Image */}
                        <div className="relative h-64 md:h-96 w-full">
                            <img
                                src={
                                    details?.backdrop_path
                                        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                                        : "/no-movie.png"
                                }
                                alt={details?.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d23] via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-8 -mt-20 relative z-10 flex flex-col md:flex-row gap-8">
                            {/* Poster */}
                            <img
                                src={
                                    details?.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                                        : "/no-movie.png"
                                }
                                alt={details?.title}
                                className="w-48 h-72 rounded-xl shadow-lg border-4 border-[#0f0d23] object-cover hidden md:block"
                            />

                            <div className="flex-1 text-white">
                                <h2 className="text-4xl font-bold mb-2">{details?.title}</h2>
                                <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                                    {details?.release_date && (
                                        <span>{details.release_date.split("-")[0]}</span>
                                    )}
                                    <span>•</span>
                                    <span>{details?.runtime} min</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                        <span>★</span>
                                        <span>{details?.vote_average?.toFixed(1)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {details?.genres?.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-200"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    {details?.overview}
                                </p>

                                {/* Cast */}
                                <h3 className="text-xl font-bold mb-4 text-white">Top Cast</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {details?.credits?.cast?.slice(0, 5).map((actor) => (
                                        <div key={actor.id} className="flex flex-col items-center min-w-[80px]">
                                            <img
                                                src={
                                                    actor.profile_path
                                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                        : "/no-poster.png" // We might want a generic avatar here
                                                }
                                                alt={actor.name}
                                                className="w-16 h-16 rounded-full object-cover mb-2 border border-white/20"
                                            />
                                            <span className="text-xs text-center text-gray-300 font-medium line-clamp-2">
                                                {actor.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Trailer */}
                                {details?.videos?.results?.find(vid => vid.type === "Trailer" && vid.site === "YouTube") && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold mb-4 text-white">Trailer</h3>
                                        <div className="relative pt-[56.25%] w-full rounded-xl overflow-hidden bg-black">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${details.videos.results.find(vid => vid.type === "Trailer" && vid.site === "YouTube").key}`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;
