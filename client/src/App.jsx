import { useState, useEffect } from 'react'
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import './index.css'

export default function App(){
  const [currentRoute, setCurrentRoute] = useState(()=>{
    return window.location.hash.replace('#', '') || 'home';
  });

  const year = new Date().getFullYear();

  useEffect(() => {
    const handleHashChange = () => {
      const page = window.location.hash.replace('#', '') || 'home';
      setCurrentRoute(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page) => {
    window.location.hash = page;
    setCurrentRoute(page);
  };

  const renderPage = () => {
    switch (currentRoute) {
      case 'gallery':
        return <Gallery navigate={navigate} />;
      case 'contact':
        return <Contact navigate={navigate} />;
      case 'admin':
        return <Admin />;
      case 'home':
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentRoute={currentRoute} navigate={navigate} />
      <main className="container">
        {renderPage()}
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span>&copy; {year} [Company Name]. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );

}