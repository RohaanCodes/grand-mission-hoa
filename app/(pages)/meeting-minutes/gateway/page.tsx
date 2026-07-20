'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSiteSettings, createDocumentAccessRequest } from '@/lib/airtable';
import type { SiteSettings } from '@/lib/types';
import { Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function MeetingMinutesGateway() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'code' | 'email'>('code');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const init = async () => {
      const settings = await getSiteSettings();
      setSiteSettings(settings);

      const validated = localStorage.getItem('meeting_minutes_access');
      const expiry = localStorage.getItem('meeting_minutes_access_expiry');

      if (validated && expiry && new Date(expiry) > new Date()) {
        router.push('/meeting-minutes');
      }
    };
    init();
  }, [router]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings?.community_code) {
      setError('Community code not configured');
      return;
    }

    if (code.trim().toUpperCase() === siteSettings.community_code.toUpperCase()) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      localStorage.setItem('meeting_minutes_access', 'true');
      localStorage.setItem('meeting_minutes_access_expiry', expiryDate.toISOString());

      router.push('/meeting-minutes');
    } else {
      setError('Invalid Community Code. Please try again.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const successReq = await createDocumentAccessRequest(email);
    
    if (successReq) {
      setSuccess('Code has been sent to your email. Please check your inbox.');
      setEmail('');
      setActiveTab('code');
    } else {
      setError('Failed to send code. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 mx-auto text-[#CFB172] mb-4" />
          <h1 className="text-3xl font-serif font-bold text-slate-900">Access Meeting Minutes</h1>
          <p className="text-slate-600 mt-2">Enter your community code to continue</p>
        </div>

        <div className="flex mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 pb-3 text-sm font-medium transition-all ${activeTab === 'code' ? 'text-[#CFB172] border-b-2 border-[#CFB172]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Enter Code
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 pb-3 text-sm font-medium transition-all ${activeTab === 'email' ? 'text-[#CFB172] border-b-2 border-[#CFB172]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Get Code via Email
          </button>
        </div>

        {activeTab === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Community Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#CFB172] text-lg tracking-widest uppercase placeholder:text-slate-400"
                placeholder="Enter code"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {success && <p className="text-[#B38B4D] text-sm text-center flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> {success}</p>}

            <button
              type="submit"
              className="w-full bg-[#CFB172] hover:bg-[#B38B4D] text-white py-3.5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              Access Meeting Minutes <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#CFB172]"
                placeholder="you@example.com"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CFB172] hover:bg-[#B38B4D] disabled:bg-slate-400 text-white py-3.5 rounded-2xl font-semibold transition-all"
            >
              {loading ? 'Sending Code...' : 'Send Code to Email'}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}