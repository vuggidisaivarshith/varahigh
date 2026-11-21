'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your staff email and password.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      // Successfully authenticated on server and session cookie set
      router.push('/admin');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4FA] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#302343] text-white flex items-center justify-center font-serif font-bold text-lg">
              VGH
            </div>
            <span className="font-serif text-2xl font-bold text-[#302343]">VARAHI GIRLS HOSTEL</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 badge-mono border-[#C6A46A] text-[#302343]">
            <Shield className="w-3 h-3 text-[#79618E]" />
            <span>MANAGEMENT &amp; STAFF PORTAL</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#302343]">
            Administrative Sign In
          </h1>
          <p className="text-[#766D7C] text-xs max-w-sm mx-auto">
            Authorized management gateway for Owner <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>, Resident Lady Warden, and Accounts.
          </p>
        </div>

        {/* Login Card */}
        <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] border border-[#E9E1ED] shadow-sm space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#302343] mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#766D7C] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bharath@varahigirlshostel.com"
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#302343] mb-1.5">
                Staff Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#766D7C] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-navy w-full py-3 text-xs flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Operations Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Credential Hint for Local Dev */}
          <div className="p-3.5 rounded-lg bg-[#F8F4FA] border border-[#E9E1ED] text-[11px] text-[#332C38] space-y-1 font-mono">
            <p className="font-bold text-[#302343]">Default Owner Credentials:</p>
            <p>Email: <code className="text-[#302343]">bharath@varahigirlshostel.com</code></p>
            <p>Password: <code className="text-[#302343]">VarahiHostels@Bharath2026!</code></p>
          </div>
        </div>

        {/* Resident Portal Link */}
        <div className="text-center text-xs text-[#766D7C]">
          Are you a resident?{' '}
          <Link href="/resident/login" className="text-[#302343] font-bold hover:underline">
            Go to Resident Self-Service Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
