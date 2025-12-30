import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Atmosphere } from './components/layout/Atmosphere';
import { Dashboard } from './screens/Dashboard';
import { ComingSoon } from './components/common/ComingSoon';
import { Newspaper, Trophy } from 'lucide-react';

// Wrapper for Coming Soon routes to keep layout consistent
import { Map as MapScreen } from './screens/Map';
import { Rankings } from './screens/Rankings';

// Wrapper for Coming Soon routes to keep layout consistent
// Removed inline MapPage
const NewsPage = () => (
  // ... keep NewsPage as is for now or update it later if asked
  <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
    <ComingSoon
      title="Air Quality News"
      description="Stay informed with the latest updates, research, and health advisories regarding air pollution."
      icon={Newspaper}
    />
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Atmosphere />
        <Header />

        <main className="flex-1 pt-8 relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
