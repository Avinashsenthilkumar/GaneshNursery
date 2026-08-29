import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import EnquiryDrawer from './components/EnquiryDrawer.jsx';
import { EnquiryProvider } from './context/EnquiryContext.jsx';

import Home from './pages/Home.jsx';
import Plants from './pages/Plants.jsx';
import PlantDetails from './pages/PlantDetails.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Blogs from './pages/Blogs.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <EnquiryProvider>
      <div className="app-shell">
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/plants/:id" element={<PlantDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <FloatingWhatsApp />
        <EnquiryDrawer />
      </div>
    </EnquiryProvider>
  );
}
