import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SpotlightCard from '../components/common/SpotlightCard';
import { Link2, ShieldCheck, BarChart3, QrCode, Share2, ArrowRight, Sparkles, Cpu, Lock, Globe, CheckCircle2, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slateBase text-slate-900 flex flex-col relative overflow-hidden bg-grid-corporate">
      {/* Background Soft Atmospheric Blur Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] animate-pulse-subtle" />
        <div className="absolute top-[400px] -left-[150px] w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute top-[800px] -right-[150px] w-[500px] h-[500px] bg-indigo-400/15 rounded-full blur-[130px]" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Enterprise Short Links & Bio Infrastructure</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Enterprise Short Links. <br />
              <span className="text-gradient-corporate">Empowered Bio Hubs.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Build high-converting branded short URLs with real Email/SMS OTP security, real-time telemetry analytics, QR code generation, and customizable bio profiles.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto py-4 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                Create Account with OTP
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto py-4 px-8 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center shadow-sm"
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Enterprise Trust Ticker */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-500 border-t border-slate-200">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Real OTP Security
              </span>
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-600" /> Real-time Analytics
              </span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" /> httpOnly JWT Cookies
              </span>
            </div>
          </div>

          {/* Right Isometric 3D Visualization Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center perspective-[2000px]">
            <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200/80 shadow-corporate-hover rotate-x-[5deg] rotate-y-[-10deg] hover:rotate-x-[2deg] hover:rotate-y-[-5deg] transition-all duration-500 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-slate-900">Sarthak Parashar</h3>
                    <p className="text-xs text-indigo-600 font-mono">@sarthakparashar</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> OTP Verified
                </span>
              </div>

              {/* Mock Short URL Row */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-600 font-bold">lynk.hub/r/sarthak-link</span>
                  <span className="text-emerald-600 font-semibold">1,420 Clicks</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">Target: https://github.com/sarthakparashar</p>
              </div>

              {/* Mock Analytics Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Weekly Click Growth</span>
                  <span className="text-indigo-600">+84.5%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 w-4/5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Feature Section */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-600">
              ENTERPRISE PLATFORM FEATURES
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Modern Teams & Creators
            </h2>
            <p className="text-sm text-slate-600">
              Everything required to scale link distribution and present a polished digital identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <SpotlightCard className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Real Email / SMS OTP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Two-step signup authentication. Generates 6-digit OTP codes delivered via Nodemailer (Email) or Twilio (SMS).
              </p>
            </SpotlightCard>

            {/* Feature 2 */}
            <SpotlightCard className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Custom Slugs & Short URLs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate 6-character random slugs or custom branded aliases. Includes rate limiting and syntax validation.
              </p>
            </SpotlightCard>

            {/* Feature 3 */}
            <SpotlightCard className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Click Telemetry Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track clicks over time, top referrers, device distributions (Desktop, Mobile, Tablet), and SHA-256 hashed IPs.
              </p>
            </SpotlightCard>

            {/* Feature 4 */}
            <SpotlightCard className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Custom Bio Profiles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public profile hosted at <code className="text-indigo-600 font-mono">/bio/:username</code> with 4 customizable visual themes.
              </p>
            </SpotlightCard>

            {/* Feature 5 */}
            <SpotlightCard className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Instant QR Code Generator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate vector QR codes for any short URL directly in your dashboard and download high-resolution PNGs.
              </p>
            </SpotlightCard>

            {/* Feature 6 */}
            <SpotlightCard className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">MongoDB Compass Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All accounts, links, and telemetry automatically persist to local MongoDB Compass at <code className="text-indigo-600 font-mono">mongodb://127.0.0.1:27017</code>.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
