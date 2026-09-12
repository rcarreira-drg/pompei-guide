import { Routes, Route, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Prepare from './pages/Prepare';
import SectionPage from './pages/SectionPage';
import Visit from './pages/Visit';
import StopPage from './pages/StopPage';
import Practical from './pages/Practical';
import OfficialMap from './pages/OfficialMap';
import QuizPage from './pages/QuizPage';
import Onboarding, { OnboardingHelp } from './pages/Onboarding';
import { hasRedirectedThisSession, isOnboarded, markRedirectedThisSession } from './lib/onboarding';
import './styles/app.css';
import './styles/pages.css';
import './styles/extras.css';
import './styles/onboarding.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }); }, [pathname]);
  return null;
}

/** En la primera visita a "/" sin onboarding completado, redirige a la bienvenida (una sola vez por sesión). */
function FirstVisitRedirect() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === '/' && !isOnboarded() && !hasRedirectedThisSession()) {
      markRedirectedThisSession();
      navigate('/bienvenida/1', { replace: true });
    }
  }, [pathname, navigate]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith('/bienvenida');

  return (
    <>
      <ScrollToTop />
      <FirstVisitRedirect />
      <main id="main">
        <div key={pathname} className="page-enter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/preparar" element={<Prepare />} />
            <Route path="/preparar/quiz" element={<QuizPage />} />
            <Route path="/preparar/:id" element={<SectionPage />} />
            <Route path="/visita" element={<Visit />} />
            <Route path="/visita/:id" element={<StopPage />} />
            <Route path="/practico" element={<Practical />} />
            <Route path="/mapa" element={<OfficialMap />} />
            <Route path="/mapa/:key" element={<OfficialMap />} />
            <Route path="/bienvenida" element={<Navigate to="/bienvenida/1" replace />} />
            <Route path="/bienvenida/:n" element={<Onboarding />} />
            <Route path="/ayuda" element={<OnboardingHelp />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>
      {!hideNav && (
        <nav className="bottom-nav" aria-label="Navegación principal">
          <NavLink to="/" end>INICIO</NavLink>
          <NavLink to="/preparar">PREPARAR</NavLink>
          <NavLink to="/visita">VISITA</NavLink>
          <NavLink to="/mapa">PLANO</NavLink>
          <NavLink to="/practico">PRÁCTICO</NavLink>
        </nav>
      )}
    </>
  );
}
