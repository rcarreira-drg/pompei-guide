import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Prepare from './pages/Prepare';
import SectionPage from './pages/SectionPage';
import Visit from './pages/Visit';
import StopPage from './pages/StopPage';
import Practical from './pages/Practical';
import QuizPage from './pages/QuizPage';
import './styles/app.css';
import './styles/pages.css';
import './styles/extras.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preparar" element={<Prepare />} />
          <Route path="/preparar/quiz" element={<QuizPage />} />
          <Route path="/preparar/:id" element={<SectionPage />} />
          <Route path="/visita" element={<Visit />} />
          <Route path="/visita/:id" element={<StopPage />} />
          <Route path="/practico" element={<Practical />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <nav className="bottom-nav" aria-label="Navegación principal">
        <NavLink to="/" end>INICIO</NavLink>
        <NavLink to="/preparar">PREPARAR</NavLink>
        <NavLink to="/visita">VISITA</NavLink>
        <NavLink to="/practico">PRÁCTICO</NavLink>
      </nav>
    </>
  );
}
