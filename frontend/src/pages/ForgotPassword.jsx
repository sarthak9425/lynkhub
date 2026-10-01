import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SpotlightCard from '../components/common/SpotlightCard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { KeyRound, Mail, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slateBase text-slate-900 flex flex-col justify-between bg-grid-corporate relative">
      <Navbar />

      <main className="max-w-md w-full mx-auto px-4 py-12 my-auto relative z-10">
        <SpotlightCard className="p-8 border-slate-200/80 shadow-corporate-card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-3 shadow-sm">
              <KeyRound className="w-6 h-6 text-amber-600" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">Forgot Password</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Enter your registered email address to receive a 6-digit password reset OTP code
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message ? (
            <div className="space-y-4 text-center animate-fadeIn">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-slate-900">{message}</p>
                <p className="text-slate-600">Please check your email inbox for the 6-digit OTP code.</p>
              </div>

              <button
                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2"
              >
                Proceed to Reset Password <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarthak@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Reset OTP...
                  </>
                ) : (
                  <>
                    Send Password Reset OTP <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
            Remembered your password?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </SpotlightCard>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
