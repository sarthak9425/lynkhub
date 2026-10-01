import React from 'react';
import { Github, Linkedin, Twitter, Globe, FileText, Youtube, Instagram, Facebook, ExternalLink, Link as LinkIcon } from 'lucide-react';

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  portfolio: Globe,
  resume: FileText,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  website: Globe,
  other: LinkIcon
};

const SocialLinkItem = ({ link, theme = 'corporate-trust' }) => {
  const Icon = ICON_MAP[link.platform] || LinkIcon;

  let buttonStyles = '';
  if (theme === 'corporate-trust') {
    buttonStyles = 'bg-white border border-slate-200/80 hover:border-indigo-500 hover:shadow-corporate-hover text-slate-900 shadow-corporate-card';
  } else if (theme === 'bitcoin-gold') {
    buttonStyles = 'bg-surface/80 border border-amber-500/40 hover:border-amber-400 hover:shadow-lg text-white shadow-md';
  } else if (theme === 'dark-slate') {
    buttonStyles = 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-indigo-500/50 text-white shadow-lg';
  } else if (theme === 'minimal-light') {
    buttonStyles = 'bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md text-slate-800 shadow-sm';
  } else if (theme === 'gradient') {
    buttonStyles = 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 text-white shadow-lg';
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full p-4 rounded-full flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 group ${buttonStyles}`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pl-1">
        <div className={`p-2.5 rounded-full shrink-0 ${
          theme === 'corporate-trust' || theme === 'minimal-light' ? 'bg-indigo-50 text-indigo-600' : 'bg-white/10 text-amber-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-heading font-semibold text-sm truncate">
          {link.label || link.platform.toUpperCase()}
        </span>
      </div>

      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity shrink-0 mr-2 text-indigo-600" />
    </a>
  );
};

export default SocialLinkItem;
