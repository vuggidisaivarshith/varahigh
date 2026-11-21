'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Smartphone, KeyRound, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function ResidentLoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // Method 1: Mobile + OTP
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Method 2: Resident ID + Password
  const [residentId, setResidentId] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification OTP.');
      }

      setOtpSent(true);
      setStatusMessage({
        type: 'success',
        text: data.message || `Verification code sent to +91 ${cleanPhone}.`,
      });
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/resident-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'otp',
          phone,
          otp: otpCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed.');
      }

      router.push('/resident/dashboard');
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/resident-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'password',
          resident_id: residentId,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed.');
      }

      router.push('/resident/dashboard');
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
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
            <span>RESIDENT SELF-SERVICE PORTAL</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#302343]">
            Resident Sign In
          </h1>
          <p className="text-xs text-[#766D7C]">
            Sign in to access rent invoices, online UPI payments, advance balance, and digital receipts.
          </p>
        </div>

        {/* Login Card */}
        <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] border border-[#E9E1ED] shadow-sm space-y-6">
          {/* Dual Auth Switcher Tabs */}
          <div className="bg-[#F8F4FA] p-1.5 rounded-xl border border-[#E9E1ED] grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setStatusMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'otp'
                  ? 'bg-white text-[#302343] shadow-xs border border-[#E9E1ED]'
                  : 'text-[#766D7C] hover:text-[#302343]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile + OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setStatusMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'password'
                  ? 'bg-white text-[#302343] shadow-xs border border-[#E9E1ED]'
                  : 'text-[#766D7C] hover:text-[#302343]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Resident ID
            </button>
          </div>

          {/* Alert Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-[#79618E]/10 border border-[#79618E]/30 text-[#79618E]'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Flow 1: Mobile + OTP */}
          {authMethod === 'otp' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#302343] mb-1.5">
                    Registered Mobile Number
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-[#E9E1ED] bg-[#F8F4FA] focus-within:border-[#79618E] focus-within:ring-1 focus-within:ring-[#79618E]">
                    <span className="px-3.5 py-2.5 text-xs font-mono text-[#766D7C] bg-[#E9E1ED]/40 flex items-center border-r border-[#E9E1ED]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9849111222"
                      className="w-full bg-transparent px-3 py-2.5 text-xs text-[#302343] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#766D7C] mt-1">
                    Enter the phone number registered during hostel admission.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-navy w-full py-3 text-xs flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-[#302343]">
                      6-Digit Security OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-[#79618E] hover:underline font-mono"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-center text-sm font-mono tracking-widest text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                  <p className="text-[11px] text-[#766D7C] mt-1 text-center font-mono">
                    Development default OTP is: <strong className="text-[#302343]">123456</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-emerald-cta w-full py-3 text-xs flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Verifying...' : 'Verify OTP & Open Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )
          ) : (
            /* Flow 2: Resident ID + Password */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#302343] mb-1.5">
                  Permanent Resident ID
                </label>
                <input
                  type="text"
                  required
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  placeholder="e.g. VG1-1-00001"
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] font-mono focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#302343] mb-1.5">
                  Account Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-navy w-full py-3 text-xs flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In with Resident ID'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Credentials */}
          <div className="p-3.5 rounded-lg bg-[#F8F4FA] border border-[#E9E1ED] text-[11px] text-[#332C38] space-y-1 font-mono">
            <p className="font-bold text-[#302343]">Active Resident Demo Credentials:</p>
            <p>Mobile: <code className="text-[#302343]">9849111222</code> (OTP: <code className="text-[#302343]">123456</code>)</p>
            <p>Resident ID: <code className="text-[#302343]">VG1-1-00001</code></p>
            <p>Password: <code className="text-[#302343]">VarahiResident@2026!</code></p>
          </div>
        </div>

        {/* Staff Login Link */}
        <div className="text-center text-xs text-[#766D7C]">
          Are you a staff member?{' '}
          <Link href="/admin/login" className="text-[#302343] font-bold hover:underline">
            Go to Management &amp; Staff Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}
