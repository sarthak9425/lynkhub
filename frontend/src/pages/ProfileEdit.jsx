import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProfileForm from '../components/profile/ProfileForm';
import SocialLinksEditor from '../components/profile/SocialLinksEditor';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Sparkles, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveProfile = async (formData) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await api.put('/profile/me', formData);
      if (res.data.success) {
        updateUser(res.data.user);
        setSuccessMessage('Profile and theme settings saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSocialLinks = async (socialLinks) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await api.put('/profile/me', { socialLinks });
      if (res.data.success) {
        updateUser(res.data.user);
        setSuccessMessage('Social links saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update social links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slateBase text-slate-900 flex flex-col justify-between bg-grid-corporate relative">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-corporate-card">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight">Customize Bio Profile</h1>
            <p className="text-xs text-slate-500 font-medium">
              Configure avatar, bio text, social media buttons, and visual theme.
            </p>
          </div>

          <Link
            to={`/bio/${user?.username || 'sarthakparashar'}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-indigo-btn hover:-translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Live Preview (/bio/{user?.username || 'sarthakparashar'})
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Success / Error Feedback */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Basic Profile & Theme Form */}
        <ProfileForm user={user} onSave={handleSaveProfile} loading={loading} />

        {/* Social Links Form */}
        <SocialLinksEditor initialLinks={user?.socialLinks || []} onSave={handleSaveSocialLinks} loading={loading} />
      </main>

      <Footer />
    </div>
  );
};

export default ProfileEdit;
