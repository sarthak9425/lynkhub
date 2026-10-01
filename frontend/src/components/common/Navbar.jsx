import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Link2, LayoutDashboard, UserCheck, ExternalLink, LogOut, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Corporate Trust Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-0.5 shadow-indigo-btn group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center text-indigo-600">
              <Link2 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Lynk<span className="text-gradient-corporate">Hub</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase -mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Enterprise Link Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
                  isActive('/dashboard')
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-btn'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
                  isActive('/profile')
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-btn'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Bio Profile
              </Link>
              <Link
                to={`/bio/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200 flex items-center gap-1.5 border border-indigo-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Public Bio
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : null}
        </div>

        {/* Desktop Right Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">
                  {user.name || 'Sarthak Parashar'}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-btn hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-indigo-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 transition-all">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-2">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border border-indigo-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-heading font-semibold text-slate-900">{user.name || 'Sarthak Parashar'}</span>
                  <span className="text-xs font-mono text-indigo-600">@{user.username}</span>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <UserCheck className="w-4 h-4 text-violet-600" />
                Bio Profile
              </Link>
              <Link
                to={`/bio/${user.username}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                View Public Bio
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center rounded-full text-xs font-semibold text-slate-700 bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-btn"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
