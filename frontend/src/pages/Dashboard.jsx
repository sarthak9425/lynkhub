import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LinkShortenerForm from '../components/dashboard/LinkShortenerForm';
import LinkList from '../components/dashboard/LinkList';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import { useAuth } from '../context/AuthContext';
import { Link2, BarChart3, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('links');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slateBase text-slate-900 flex flex-col justify-between bg-grid-corporate relative">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* User Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-corporate-card">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.name || 'Sarthak Parashar'} 👋
              </h1>
              {user?.isEmailVerified && (
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> OTP Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Manage branded short links, inspect real-time click telemetry, and customize your bio profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/bio/${user?.username || 'sarthakparashar'}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Public Bio (/bio/{user?.username || 'sarthakparashar'})
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Switching Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('links')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
              activeTab === 'links'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-btn'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Shortener & Links
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-btn'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Telemetry Analytics
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'links' ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Shortener Form */}
            <LinkShortenerForm onLinkCreated={triggerRefresh} />

            {/* Links List */}
            <LinkList refreshTrigger={refreshTrigger} onLinkDeleted={triggerRefresh} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <AnalyticsView refreshTrigger={refreshTrigger} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
