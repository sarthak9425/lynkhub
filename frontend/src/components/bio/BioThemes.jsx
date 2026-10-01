import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { ShieldCheck, Link2 } from 'lucide-react';

const BioThemes = ({ profile }) => {
  const { name, username, avatarUrl, bio, socialLinks, theme } = profile;

  let containerBg = 'bg-slateBase text-slate-900 bg-grid-corporate';
  let cardClass = 'bg-white border border-slate-200/80 shadow-corporate-hover';
  let titleColor = 'text-slate-900';
  let bioColor = 'text-slate-600';

  if (theme === 'corporate-trust') {
    containerBg = 'bg-slateBase text-slate-900 bg-grid-corporate';
    cardClass = 'bg-white border border-slate-200/80 shadow-corporate-hover backdrop-blur-xl';
    titleColor = 'text-slate-900';
    bioColor = 'text-slate-600';
  } else if (theme === 'bitcoin-gold') {
    containerBg = 'bg-[#030304] text-white';
    cardClass = 'bg-[#0F1115]/90 border border-amber-500/40 shadow-2xl backdrop-blur-2xl';
    titleColor = 'text-white';
    bioColor = 'text-slate-400';
  } else if (theme === 'dark-slate') {
    containerBg = 'bg-[#0B0F17] text-[#EDEDEF]';
    cardClass = 'bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] shadow-2xl backdrop-blur-2xl';
    titleColor = 'text-white';
    bioColor = 'text-slate-400';
  } else if (theme === 'minimal-light') {
    containerBg = 'bg-[#F8FAFC] text-slate-900';
    cardClass = 'bg-white border border-slate-200/80 shadow-xl';
    titleColor = 'text-slate-900';
    bioColor = 'text-slate-600';
  } else if (theme === 'gradient') {
    containerBg = 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white';
    cardClass = 'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl';
    titleColor = 'text-white';
    bioColor = 'text-slate-300';
  }

  return (
    <div className={`min-h-screen py-12 px-4 flex flex-col items-center justify-between ${containerBg}`}>
      {/* Background Soft Ambient Orbs */}
      {theme === 'corporate-trust' && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse-subtle" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-violet-500/10 rounded-full blur-[130px]" />
        </div>
      )}

      <div className="w-full max-w-md mx-auto relative z-10 my-auto">
        {/* Profile Card Header */}
        <div className={`p-8 rounded-3xl text-center space-y-5 ${cardClass}`}>
          {/* Avatar */}
          <div className="relative inline-block">
            <img
              src={avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${username || 'sarthakparashar'}`}
              alt={name || 'Sarthak Parashar'}
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-lg mx-auto ring-4 ring-indigo-500/20"
            />
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg border-2 border-white" title="Verified Profile">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* User Meta */}
          <div>
            <h1 className={`font-heading text-2xl font-extrabold tracking-tight ${titleColor}`}>{name || 'Sarthak Parashar'}</h1>
            <p className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">@{username || 'sarthakparashar'}</p>
          </div>

          {/* Bio text */}
          {bio && (
            <p className={`text-sm leading-relaxed px-2 font-body ${bioColor}`}>
              {bio}
            </p>
          )}

          {/* Social Links List */}
          <div className="pt-4 space-y-3">
            {socialLinks && socialLinks.length > 0 ? (
              socialLinks.map((link, idx) => (
                <SocialLinkItem key={idx} link={link} theme={theme} />
              ))
            ) : (
              <div className="py-6 text-xs font-mono opacity-60">
                No public links added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Powered By */}
      <div className="mt-8 text-center relative z-10">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
        >
          <Link2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Powered by <strong className="text-gradient-corporate">LynkHub</strong></span>
        </a>
      </div>
    </div>
  );
};

export default BioThemes;
