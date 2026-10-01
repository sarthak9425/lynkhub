import React, { useState } from 'react';
import SpotlightCard from '../common/SpotlightCard';
import { User, Sparkles, Check, Loader2 } from 'lucide-react';

const THEMES = [
  {
    id: 'corporate-trust',
    name: 'Corporate Trust',
    description: 'Enterprise SaaS white aesthetic with indigo-to-violet gradients',
    bg: 'bg-[#F8FAFC]',
    accent: 'border-indigo-500 text-indigo-600'
  },
  {
    id: 'bitcoin-gold',
    name: 'Bitcoin Gold',
    description: 'Deep cosmic void with Bitcoin orange and digital gold luminescent cards',
    bg: 'bg-[#030304]',
    accent: 'border-amber-500 text-amber-500'
  },
  {
    id: 'dark-slate',
    name: 'Dark Slate',
    description: 'Linear style deep near-black slate with glowing indigo accents',
    bg: 'bg-[#0B0F17]',
    accent: 'border-indigo-500/50 text-indigo-400'
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Crisp off-white background with refined dark typography',
    bg: 'bg-[#F8FAFC]',
    accent: 'border-slate-400 text-slate-800'
  },
  {
    id: 'gradient',
    name: 'Vibrant Gradient',
    description: 'Luminous deep indigo to purple radial mesh gradient',
    bg: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
    accent: 'border-purple-400 text-purple-300'
  }
];

const ProfileForm = ({ user, onSave, loading }) => {
  const [name, setName] = useState(user?.name || 'Sarthak Parashar');
  const [username, setUsername] = useState(user?.username || 'sarthakparashar');
  const [bio, setBio] = useState(user?.bio || 'Full-stack developer building enterprise tools & bio profile hubs.');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [theme, setTheme] = useState(user?.theme || 'corporate-trust');
  const [avatarMode, setAvatarMode] = useState('url');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image file size must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, username, bio, avatarUrl, theme });
  };

  return (
    <SpotlightCard className="p-6 md:p-8 border-slate-200/80 shadow-corporate-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl text-slate-900 tracking-tight">Basic Profile Details</h2>
          <p className="text-xs text-slate-500 font-medium">Update display name, bio description, avatar, and public bio theme</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Preview & Inputs */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Avatar Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${username || 'sarthakparashar'}`}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md shrink-0"
            />
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarMode('url')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    avatarMode === 'url' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarMode('upload')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    avatarMode === 'upload' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {avatarMode === 'url' ? (
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>

        {/* Name & Username Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Display Name <span className="text-indigo-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarthak Parashar"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Bio Handle / Username <span className="text-indigo-600">*</span>
            </label>
            <div className="flex items-center rounded-lg bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
              <span className="px-3 py-2.5 text-xs font-mono text-slate-500 bg-slate-50 border-r border-slate-200">
                /bio/
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="sarthakparashar"
                className="w-full px-3 py-2.5 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bio Text */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Short Bio / Description
          </label>
          <textarea
            rows={3}
            maxLength={300}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Full-stack developer building enterprise applications and custom bio profile hubs."
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <p className="text-[11px] text-right font-mono text-slate-400 mt-1">
            {bio.length}/300 characters
          </p>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Bio Page Theme Selector
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {THEMES.map((t) => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${t.bg} ${
                  theme === t.id
                    ? 'border-indigo-600 shadow-corporate-hover scale-[1.02]'
                    : 'border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                {theme === t.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <h4 className={`font-heading text-sm font-bold mb-1 ${t.id === 'minimal-light' || t.id === 'corporate-trust' ? 'text-slate-900' : 'text-white'}`}>
                  {t.name}
                </h4>
                <p className={`text-[11px] leading-relaxed ${t.id === 'minimal-light' || t.id === 'corporate-trust' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            'Save Profile & Theme Settings'
          )}
        </button>
      </form>
    </SpotlightCard>
  );
};

export default ProfileForm;
