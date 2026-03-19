<div align="center">
  <img src="./public/logo.png" alt="CineMetrics Logo" width="100"/>
  <h1>🎬 CineMetrics</h1>
  <p>A portfolio-grade movie discovery web app powered by React and TMDB.</p>
  
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](#)
  [![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](#)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](#)
  
  [**Live Demo**](https://movies26.netlify.app/) • [**Report Bug**](#)
</div>

<br />

## 🌟 Overview

**CineMetrics** is a next-generation movie discovery platform providing seamless exploration of cinema. It integrates real-time data from the TMDB API, offering a highly responsive, cinematic, and personalized user experience without the noise of typical web apps.

![CineMetrics Mockup Dashboard](./public/hero-bg.png) 
*(A gorgeous Glassmorphic UI tailored for movie lovers)*

---

## ✨ Key Features

- **🔥 Dynamic Tab Endpoints:** Quickly switch between *Trending*, *Popular*, *Top Rated*, and *Now Playing* movies with dedicated API fetching.
- **🔎 Debounced Search:** Instant multi-character search capabilities, optimized with a strict 500ms delay and `AbortController` request cancellation to prevent unnecessary API clutter.
- **🎛️ Advanced Filtering:** Visually filter results based on exact *Genres*, *Release Year Ranges*, and *Minimum Ratings* dynamically.
- **🔖 Persistent Watchlist:** Effortlessly save and manage your favorites using React's contextual logic and `localStorage` persistence.
- **🎥 Immersive Movie Details:** Dedicated dynamic routing (`/movie/:id`) rendering edge-to-edge transparent backdrops, extensive cast carousels, and embedded official YouTube trailers.
- **💀 Premium Loading States:** Smooth, aesthetic skeleton frames mimicking layout content before data populates.

---

## 🛠️ Built With

- **[React 19](https://react.dev/)** + **[Vite](https://vitejs.dev/)**
- **[React Router v6](https://reactrouter.com/)** (Client-side routing)
- **[Tailwind CSS v4](https://tailwindcss.com/)** (Utility-first styling)
- **[TMDB API](https://developer.themoviedb.org/docs)** (Backend Movie Infrastructure)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js installed in your environment. You will also need an API key from TMDB.
1. Sign up at [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Navigate to Settings > API to retrieve your `v3 Auth` API Key.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush-delta/cinemetrics.git
   cd cinemetrics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root of the project:
   ```env
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```

4. **Launch the development server**
   ```bash
   npm run dev
   ```

---

## 🧠 What I Learned

Building CineMetrics was a phenomenal exercise in scaling a React application effectively:
- **API Architecture:** Moving API fetch logic outside of components into a dedicated `services/api.js` pattern resulted in substantially cleaner, modular UI code.
- **Custom Hooks:** Engineering custom hooks like `useDebounce`, `useFetch`, and `useWatchlist` made complex asynchronous and local DOM logic completely reusable.
- **Request Cancellation:** Applying `AbortController` natively taught me how to strictly prevent React state updates on unmounted component trees and efficiently handle in-flight request racing.
- **Routing:** Setting up `react-router-dom` showed the power of declarative routing, URL parameters, and layout isolation.

---

<div align="center">
  <p>Designed and Built by <b>Ayush</b></p>
  <i>If you like this project, consider giving it a ⭐!</i>
</div>
