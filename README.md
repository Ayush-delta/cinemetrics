# 🎬 Trending Movies App

A responsive React application that displays trending movies using the TMDB API with real-time search functionality, infinite scrolling, and immersive movie details.

---

## ✨ Features

- **🔥 Real-time Trending**: Displays top weekly trending movies from TMDB.
- **🔎 Live Search**: Instant search results as you type.
- **🎥 Interactive Details**: Click any movie to open a rich modal with backstory, cast, and trailer.
- **🔄 Infinite Discovery**: "Load More" functionality for endless browsing.
- **💀 Smart Loading**: Polished skeleton screens for a premium loading experience.
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop.
- **🎨 Modern UI**: Glassmorphism effects, smooth animations, and a custom dark theme.

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **API**: TMDB (The Movie Database)
- **Backend**: Appwrite (for search analytics)
- **Icons**: Heroicons / Lucide React

---

## 🚀 Quick Start

1. **Clone and install**

```bash
git clone https://github.com/Ayush-delta/cinemetrics.git
cd cinemetrics
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add your TMDB API key:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

4. **Run the app**

```bash
npm run dev
```

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── MovieCard.jsx       # Individual movie display component
│   ├── MovieDetails.jsx    # Modal for extended movie info (Cast, Trailer)
│   ├── Search.jsx          # Search input component with debounce
│   ├── SkeletonCard.jsx    # Loading state placeholder
│   └── Spinner.jsx         # Loading spinner
├── App.jsx                 # Main application logic
├── appwrite.js             # Appwrite configuration for analytics
├── index.css               # Global styles and Tailwind directives
└── main.jsx                # Entry point
```

---

## 🎯 How It Works

- **Trending Section**: Fetches and showcases the top 5 weekly trending movies.
- **Search**: Users can search for any movie; results update in real-time.
- **Movie Details**: Clicking a card opens a modal with:
    - High-res backdrop
    - Rating, Runtime, and Year
    - Genres
    - Cast members with photos
    - Official YouTube Trailer
- **Pagination**: The "Load More" button fetches the next page of results, appending them to the list.

---

## 📜 License

MIT License - Free to use and modify.


