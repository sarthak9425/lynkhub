import React, { useState } from 'react';
import SpotlightCard from '../common/SpotlightCard';
import { Share2, Plus, Trash2, Github, Linkedin, Twitter, Globe, FileText, Youtube, Instagram, Facebook, Link as LinkIcon } from 'lucide-react';

const PLATFORMS = [
  { id: 'github', label: 'GitHub', icon: Github },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'twitter', label: 'X / Twitter', icon: Twitter },
  { id: 'portfolio', label: 'Portfolio', icon: Globe },
  { id: 'resume', label: 'Resume / CV', icon: FileText },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'website', label: 'Website / Blog', icon: Globe },
  { id: 'other', label: 'Other Custom Link', icon: LinkIcon },
];

const SocialLinksEditor = ({ initialLinks = [], onSave, loading }) => {
  const [links, setLinks] = useState(initialLinks);

  const addLink = () => {
    setLinks([...links, { platform: 'github', label: 'My GitHub Profile', url: '' }]);
  };

  const removeLink = (index) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(links);
  };

  return (
    <SpotlightCard className="p-6 md:p-8 border-slate-200/80 shadow-corporate-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-slate-900 tracking-tight">Social Media & Public Links</h2>
            <p className="text-xs text-slate-500 font-medium">Add, edit, or reorder dynamic social links on your Bio profile</p>
          </div>
        </div>

        <button
          type="button"
          onClick={addLink}
          className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Link
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {links.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-xs font-medium">
            No social links added yet. Click &quot;Add Link&quot; above to include your GitHub, LinkedIn, or Portfolio!
          </div>
        ) : (
          links.map((link, index) => {
            const platformObj = PLATFORMS.find(p => p.id === link.platform) || PLATFORMS[0];
            const PlatformIcon = platformObj.icon;

            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group animate-fadeIn"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <PlatformIcon className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Link #{index + 1}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="p-1.5 rounded-full text-rose-600 hover:bg-rose-100 transition-colors text-xs"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Platform Selector */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Platform
                    </label>
                    <select
                      value={link.platform}
                      onChange={(e) => handleChange(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Label Input */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => handleChange(index, 'label', e.target.value)}
                      placeholder="e.g. My GitHub"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Target URL */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Destination URL
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleChange(index, 'url', e.target.value)}
                      placeholder="https://github.com/sarthakparashar"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
        >
          Save Social Links
        </button>
      </form>
    </SpotlightCard>
  );
};

export default SocialLinksEditor;
