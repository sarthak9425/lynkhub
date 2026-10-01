import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SpotlightCard from '../components/common/SpotlightCard';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slateBase text-slate-900 flex flex-col justify-between bg-grid-corporate relative">
      <Navbar />

      <main className="max-w-md w-full mx-auto px-4 py-12 my-auto relative z-10 text-center">
        <SpotlightCard className="p-8 space-y-4 border-slate-200/80 shadow-corporate-card">
          <h1 className="font-heading text-6xl font-extrabold text-gradient-corporate">404</h1>
          <h2 className="font-heading text-xl font-bold text-slate-900">Page Not Found</h2>
          <p className="text-xs text-slate-500 font-medium">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block py-3 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all"
          >
            Return to Home Page
          </Link>
        </SpotlightCard>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
