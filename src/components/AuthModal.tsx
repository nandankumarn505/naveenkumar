import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Compass } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  showRegisterPrompt?: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  showRegisterPrompt = false,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  function reset() {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  }

  function switchMode(m: typeof mode) {
    reset();
    setMode(m);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (mode === 'register') {
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setSuccess('Account created! You are now logged in.');
        setTimeout(onClose, 1500);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setSuccess('Password reset link sent to your email.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

        <div className="p-8">
          {/* Register prompt banner */}
          {showRegisterPrompt && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
              <p className="text-amber-400 font-semibold text-sm">
                Please register to book your trip with us!
              </p>
            </div>
          )}

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <div className="text-sm font-black text-white leading-none">INDIAN TOURISTER</div>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-black text-white text-center mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            {mode === 'login'
              ? 'Sign in to manage your bookings'
              : mode === 'register'
              ? 'Join Indian Tourister for exclusive deals'
              : 'Enter your email to receive a reset link'}
          </p>

          {/* Error/Success */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl pl-10 pr-10 py-3 text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In'
                : mode === 'register'
                ? 'Create Account'
                : 'Send Reset Link'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === 'login' ? (
              <>
                New to Indian Tourister?{' '}
                <button onClick={() => switchMode('register')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Create an account
                </button>
              </>
            ) : mode === 'register' ? (
              <>
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Sign in
                </button>
              </>
            ) : (
              <>
                Remember your password?{' '}
                <button onClick={() => switchMode('login')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Back to login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
