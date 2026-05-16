import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import Navbar from './components/layout/Navbar.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
import Spinner from './components/ui/Spinner.jsx';
import ErrorFallback from './components/ui/ErrorFallback.jsx';
import BackToTop from './components/ui/BackToTop.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Movies = lazy(() => import('./pages/Movies.jsx'));
const TVShows = lazy(() => import('./pages/TVShows.jsx'));
const People = lazy(() => import('./pages/People.jsx'));
const MovieDetail = lazy(() => import('./pages/MovieDetail.jsx'));
const TVDetail = lazy(() => import('./pages/TVDetail.jsx'));
const Watchlist = lazy(() => import('./pages/Watchlist.jsx'));
const GenrePage = lazy(() => import('./pages/GenrePage.jsx'));
const PersonDetail = lazy(() => import('./pages/PersonDetail.jsx'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-cinema-black text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-400 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      <Navbar />

      {/* Page content padded below fixed navbar */}
      <div className="pt-[73px] pb-16 md:pb-0">
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/movies" element={<PageTransition><Movies /></PageTransition>} />
                <Route path="/tv" element={<PageTransition><TVShows /></PageTransition>} />
                <Route path="/people" element={<PageTransition><People /></PageTransition>} />
                <Route path="/movie/:id" element={<PageTransition><MovieDetail /></PageTransition>} />
                <Route path="/tv/:id" element={<PageTransition><TVDetail /></PageTransition>} />
                <Route path="/watchlist" element={<PageTransition><Watchlist /></PageTransition>} />
                <Route path="/genre/:id/:name" element={<PageTransition><GenrePage /></PageTransition>} />
                <Route path="/person/:id" element={<PageTransition><PersonDetail /></PageTransition>} />
                <Route path="/collection/:id" element={<PageTransition><CollectionDetail /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </Suspense>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
};

export default App;