import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import EnquiryDrawer from './components/EnquiryDrawer.jsx';
import Toast from './components/Toast.jsx';
import BottomNav from './components/BottomNav.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import { EnquiryProvider } from './context/EnquiryContext.jsx';

import Home from './pages/Home.jsx';
import Plants from './pages/Plants.jsx';

// Route-level code splitting: the homepage no longer ships the JavaScript for
// the blog, policy and contact pages. Previously everything was one bundle.
const PlantDetails = lazy(() => import('./pages/PlantDetails.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Blogs = lazy(() => import('./pages/Blogs.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Policy = lazy(() => import('./pages/Policy.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Remembers how far down each page you were, keyed by URL.
const scrollPositions = new Map();

function RouteChangeEffects() {
  const { pathname, search, hash, key } = useLocation();
  const navType = useNavigationType();
  const locationKey = `${pathname}${search}`;

  // Save the position continuously while you read, so it is already recorded
  // by the time you tap through to a product.
  useEffect(() => {
    const save = () => scrollPositions.set(locationKey, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      save();
      window.removeEventListener('scroll', save);
    };
  }, [locationKey]);

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return undefined; }
    }

    if (navType === 'POP') {
      // Coming back. Routes are lazy-loaded, so the page you are returning to
      // may not have painted yet and there would be nothing to scroll to —
      // previously Back just dumped you at the top of a half-drawn page.
      // Retry across a few frames until the document is tall enough.
      const target = scrollPositions.get(locationKey) ?? 0;
      if (target === 0) { window.scrollTo(0, 0); return undefined; }

      let frames = 0;
      let raf;
      const restore = () => {
        if (document.body.scrollHeight >= target + window.innerHeight || frames > 20) {
          window.scrollTo({ top: target, behavior: 'auto' });
          return;
        }
        frames += 1;
        raf = window.requestAnimationFrame(restore);
      };
      raf = window.requestAnimationFrame(restore);
      return () => window.cancelAnimationFrame(raf);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [locationKey, hash, navType, key]);

  useEffect(() => {
    // Tell screen readers a new page loaded — an SPA gives them no signal
    // otherwise, so navigation was completely silent for assistive tech.
    const live = document.getElementById('route-announcer');
    if (live) live.textContent = `${document.title} loaded`;
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <EnquiryProvider>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="app-shell">
        <RouteChangeEffects />
        <Header />
        <div id="main-content" tabIndex={-1}>
          <Suspense fallback={
            <div className="route-skeleton" role="status" aria-live="polite" aria-label="Loading">
              <span className="sk-bar sk-title" />
              <span className="sk-bar sk-line" />
              <span className="sk-bar sk-line short" />
              <div className="sk-grid">
                <span className="sk-card" /><span className="sk-card" />
                <span className="sk-card" /><span className="sk-card" />
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/plants/:id" element={<PlantDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<Policy slug="privacy-policy" />} />
              <Route path="/terms" element={<Policy slug="terms" />} />
              <Route path="/shipping-policy" element={<Policy slug="shipping-policy" />} />
              <Route path="/refund-policy" element={<Policy slug="refund-policy" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
        <FloatingWhatsApp />
        <BottomNav />
        <InstallPrompt />
        <EnquiryDrawer />
        <Toast />
        <div id="route-announcer" className="sr-only" role="status" aria-live="polite" />
      </div>
    </EnquiryProvider>
  );
}
