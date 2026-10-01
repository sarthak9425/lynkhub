import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import SpotlightCard from '../components/common/SpotlightCard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      if (!token || !email) {
        setLoading(false);
        setSuccess(false);
        setMessage('Missing token or email parameters');
        return;
      }

      try {
        const res = await api.post('/auth/verify-email', { token, email });
        if (res.data.success) {
          setSuccess(true);
          setMessage('Your email address has been verified!');
        }
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Invalid or expired verification link');
      } finally {
        setLoading(false);
      }
    };

    handleVerification();
  }, [token, email]);

  return (
    <div className="min-h-screen bg-slateBase text-slate-900 flex flex-col justify-between bg-grid-corporate relative">
      <Navbar />

      <main className="max-w-md w-full mx-auto px-4 py-12 my-auto relative z-10">
        <SpotlightCard className="p-8 text-center space-y-4 border-slate-200/80 shadow-corporate-card">
          {loading ? (
            <div className="py-8 space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-medium text-slate-500">Verifying token...</p>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="font-heading text-xl font-bold text-slate-900">Email Verified!</h2>
              <p className="text-xs font-medium text-slate-600">{message}</p>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all mt-4"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <XCircle className="w-12 h-12 text-rose-600 mx-auto" />
              <h2 className="font-heading text-xl font-bold text-slate-900">Verification Failed</h2>
              <p className="text-xs font-medium text-rose-700">{message}</p>

              <Link
                to="/dashboard"
                className="inline-block py-2.5 px-6 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors mt-4"
              >
                Continue to Dashboard
              </Link>
            </div>
          )}
        </SpotlightCard>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
