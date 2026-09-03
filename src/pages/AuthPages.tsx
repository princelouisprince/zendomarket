import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, User, ArrowRight, CheckCircle2, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onNavigate: (route: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login', onNavigate }) => {
  const { login, register, forgotPassword, showToast } = useStore();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedForgot, setSubmittedForgot] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        const res = await forgotPassword(email);
        if (res.success) setSubmittedForgot(true);
        else setErrorMsg(res.error || 'Failed to send reset email');
        return;
      }

      if (mode === 'register') {
        const res = await register(email, password, fullName);
        if (res.success) {
          onNavigate('/account');
        } else {
          setErrorMsg(res.error || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          // Direct admin & super_admin straight to /super-admin dashboard
          const role = res.role || 'customer';
          if (role === 'super_admin' || role === 'admin' || email.toLowerCase().includes('zendogroup')) {
            onNavigate('/super-admin');
          } else if (role === 'seller') {
            onNavigate('/seller');
          } else {
            onNavigate('/account');
          }
        } else {
          setErrorMsg(res.error || 'Invalid email or password');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in space-y-6">
      {/* Return to Home Link */}
      <div className="flex justify-between items-center text-xs">
        <button
          onClick={() => onNavigate('/')}
          className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>← Back to Marketplace</span>
        </button>
        <span className="text-[11px] text-brand font-bold">Kigali, Rwanda</span>
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div
          onClick={() => onNavigate('/')}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl brand-gradient text-white font-black text-2xl shadow-lg shadow-brand/20 cursor-pointer"
        >
          Z
        </div>
        <h1 className="text-2xl font-extrabold font-display text-foreground">
          {mode === 'login' && 'Sign in to Zendo Marketplace'}
          {mode === 'register' && 'Create Your Zendo Account'}
          {mode === 'forgot' && 'Reset Your Password'}
        </h1>
        <p className="text-xs text-muted-foreground">
          "Building Value. Empowering Growth." • Rwanda
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 text-foreground">
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'forgot' && submittedForgot ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We have emailed password reset instructions to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setMode('login');
                setSubmittedForgot(false);
              }}
              className="px-6 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="font-bold">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Marie Claire Mukamana"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.rw"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-brand hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl brand-gradient text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {isLoading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Mode Switcher */}
        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-brand font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-brand font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
