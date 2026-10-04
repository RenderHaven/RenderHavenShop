import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';

type Step = 'phone' | 'otp';

export default function Login() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || phone.length < 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      setStep('otp');
    } catch (err) {
      setError((err as Error).message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) { setError('Enter the OTP'); return; }
    setError('');
    setLoading(true);
    try {
      await login(phone, otp);
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* Logo */}
          <Link to="/" className="font-display font-black text-3xl text-dark tracking-widest block text-center mb-8">
            RENDERHAVEN
          </Link>

          <h1 className="font-bold text-2xl text-dark mb-1 text-center">Welcome back</h1>
          <p className="text-dark/50 text-sm text-center mb-8">
            {step === 'phone' ? 'Enter your phone to receive an OTP' : `OTP sent to +91 ${phone}`}
          </p>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  className="w-full bg-cream border border-olive/20 rounded-full pl-10 pr-4 py-3.5 text-sm text-dark focus:outline-none focus:border-olive placeholder-dark/30"
                />
              </div>

              {error && <p className="text-red-500 text-xs px-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-olive text-white font-bold py-3.5 rounded-full hover:bg-olive/80 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>
                  <span>Send OTP</span>
                  <ArrowRight size={16} />
                </>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, ''))}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full bg-cream border border-olive/20 rounded-full pl-10 pr-4 py-3.5 text-sm text-dark focus:outline-none focus:border-olive placeholder-dark/30 tracking-[0.3em] text-center font-bold"
                />
              </div>

              {error && <p className="text-red-500 text-xs px-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-olive text-white font-bold py-3.5 rounded-full hover:bg-olive/80 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>
                  <span>Verify & Login</span>
                  <ArrowRight size={16} />
                </>}
              </button>

              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                className="w-full text-sm text-dark/50 hover:text-dark transition-colors"
              >
                ← Change phone number
              </button>
            </form>
          )}

          <p className="text-center text-sm text-dark/50 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-olive font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

