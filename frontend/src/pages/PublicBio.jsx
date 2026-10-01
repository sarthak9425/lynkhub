import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import BioThemes from '../components/bio/BioThemes';
import { Loader2, AlertCircle } from 'lucide-react';

const PublicBio = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicBio = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/profile/public/${username}`);
        if (res.data.success) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Bio profile not found');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicBio();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slateBase text-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-xs">Loading Bio Profile @{username}...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slateBase text-slate-900 flex items-center justify-center p-4 bg-grid-corporate">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-4 shadow-corporate-hover">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="font-heading text-2xl font-extrabold text-slate-900">Bio Profile Not Found</h2>
          <p className="text-xs text-slate-500 font-mono">
            The bio profile <code>@{username}</code> does not exist on the network.
          </p>
          <Link
            to="/"
            className="inline-block py-3 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all"
          >
            Create Your Own Bio Profile
          </Link>
        </div>
      </div>
    );
  }

  return <BioThemes profile={profile} />;
};

export default PublicBio;
