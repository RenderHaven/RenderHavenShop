import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { authApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Step = 'details' | 'otp';

export default function Register() {
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    if (!phone || phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) { setError('Enter the OTP'); return; }
    setError('');
    setLoading(true);
    try {
      await authApi.register({ name, phone, otp, email });
      await login(phone, otp);
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <Link to="/" className="font-display font-black text-3xl text-dark tracking-widest block text-center mb-8">
            RENDERHAVEN
          </Link>

          <h1 className="font-bold text-2xl text-dark mb-1 text-center">Create Account</h1>
          <p className="text-dark/50 text-sm text-center mb-8">
            {step === 'details'
              ? 'Join thousands of artists on RenderHaven'
              : `OTP sent to +91 ${phone}`}
          </p>

          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {[
                { icon: <User size={16} />, value: name, setter: setName, type: 'text', placeholder: 'Full name' },
                { icon: <Phone size={16} />, value: phone, setter: (v: string) => setPhone(v.replace(/\D/, '')), type: 'tel', placeholder: '10-digit phone' },
                { icon: <Mail size={16} />, value: email, setter: setEmail, type: 'email', placeholder: 'Email (optional)' },
              ].map((field) => (
                <div key={field.placeholder} className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30">
                    {field.icon}
                  </span>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.type === 'tel' ? 10 : undefined}
                    className="w-full bg-cream border border-olive/20 rounded-full pl-10 pr-4 py-3.5 text-sm text-dark focus:outline-none focus:border-olive placeholder-dark/30"
                  />
                </div>
              ))}

              {error && <p className="text-red-500 text-xs px-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-olive text-white font-bold py-3.5 rounded-full hover:bg-olive/80 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>
                  <span>Continue</span><ArrowRight size={16} />
                </>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
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
                  <span>Create Account</span><ArrowRight size={16} />
                </>}
              </button>
              <button
                type="button"
                onClick={() => { setStep('details'); setOtp(''); setError(''); }}
                className="w-full text-sm text-dark/50 hover:text-dark transition-colors"
              >
                ← Edit details
              </button>
            </form>
          )}

          <p className="text-center text-sm text-dark/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-olive font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

