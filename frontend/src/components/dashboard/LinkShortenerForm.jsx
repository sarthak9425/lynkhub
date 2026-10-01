import React, { useState } from 'react';
import api from '../../services/api';
import SpotlightCard from '../common/SpotlightCard';
import { Link2, Sparkles, Check, Copy, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const LinkShortenerForm = ({ onLinkCreated }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCreatedLink(null);

    if (!longUrl.trim()) {
      setError('Please enter a destination URL');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/links', {
        longUrl: longUrl.trim(),
        customSlug: showCustomInput ? customSlug.trim() : ''
      });

      if (res.data.success) {
        setCreatedLink(res.data.link);
        setLongUrl('');
        setCustomSlug('');
        setShowCustomInput(false);
        if (onLinkCreated) onLinkCreated();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create short link';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = window.location.origin;

  return (
    <SpotlightCard className="p-6 md:p-8 border-slate-200/80 shadow-corporate-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-slate-900 tracking-tight">Create Short Link</h2>
            <p className="text-xs text-slate-500 font-medium">Generate a 6-character short URL or custom branded alias</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCustomInput(!showCustomInput);
            setError('');
          }}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          {showCustomInput ? 'Use Random Slug' : 'Custom Alias'}
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Destination Target URL <span className="text-indigo-600">*</span>
          </label>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/long-page-url"
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {showCustomInput && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Custom Alias / Slug
            </label>
            <div className="flex items-center rounded-lg bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <span className="px-3.5 py-3 text-xs font-mono text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
                {domain}/r/
              </span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="sarthak-custom-link"
                className="w-full px-3 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Shortening URL...
            </>
          ) : (
            <>
              Shorten URL <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Success Result */}
      {createdLink && (
        <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Short Link Ready!
            </span>
            <span className="text-xs font-mono text-slate-500">Slug: {createdLink.slug}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${domain}/r/${createdLink.slug}`}
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-indigo-600 font-mono text-xs selection:bg-indigo-100"
            />
            <button
              onClick={() => handleCopy(`${domain}/r/${createdLink.slug}`)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold uppercase shadow-indigo-btn hover:-translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </SpotlightCard>
  );
};

export default LinkShortenerForm;
