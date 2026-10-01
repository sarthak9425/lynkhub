import React from 'react';
import { Link2, ShieldCheck, Zap, Sparkles, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Link2 className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-slate-900 text-base tracking-tight">
              Lynk<span className="text-gradient-corporate">Hub</span>
            </span>
            <span className="text-xs text-slate-500 border-l border-slate-200 pl-3">
              Enterprise Short Links & Bio Infrastructure
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Real OTP Delivery & JWT Cookies
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Real-time Telemetry
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              Custom Bio Profiles
            </span>
          </div>

          <p className="text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} LynkHub. MERN Stack Architecture.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
