import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import Watchlist from './pages/Watchlist.jsx';

const App = () => {
  return (
    <main className="overflow-x-hidden pt-4 pb-12">
      <div className="pattern" />
      <div className="wrapper max-w-7xl mx-auto flex flex-col items-center">
        <Navbar />
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </div>
      </div>
    </main>
  );
};

export default App;