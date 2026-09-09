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

function RouteChangeEffects() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Anchor links were swallowed by the blanket scroll-to-top, and pressing
    // Back reset you to the top of the previous page instead of returning you
    // to where you had been reading.
    if (hash) {
      const target = document.querySelector(hash);
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    if (navType === 'POP') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash, navType]);

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
          <Suspense fallback={<div className="route-loading" role="status" aria-live="polite">Loading…</div>}>
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
