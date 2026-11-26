'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Eye, EyeOff } from 'lucide-react';
import AuthVisual from '@/components/AuthVisual';
import { api } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    if (
      password.length < 8 ||
      password.length > 72 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      setError(
        'Use 8–72 characters, including at least one letter and one number.',
      );
      return;
    }

    setLoading(true);

    try {
      await api.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      });

      router.push('/login?registered=1');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Unable to create account.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <AuthVisual />

      <section className="form-panel">
        <div className="form-wrap">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="brand-mark">G</div>
            <span className="font-bold tracking-widest">GANTAVYA</span>
          </div>

          <div className="mb-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <Compass size={22} />
            </div>

            <p className="text-sm font-semibold text-emerald-800">
              YOUR JOURNEY BEGINS
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join Gantavya and start exploring Nepal.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="fullName">
                Full name
              </label>
              <input
                className="field"
                id="fullName"
                autoComplete="name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
                maxLength={120}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="email">
                Email address
              </label>
              <input
                className="field"
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="field pr-12"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={72}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Include at least one letter and one number.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                className="field"
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                maxLength={72}
              />
            </div>

            {error && (
              <div role="alert" className="error-box">
                {error}
              </div>
            )}

            <button className="primary-btn !mt-5" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link className="subtle-link" href="/login">
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            Your details are protected and never displayed publicly.
          </p>
        </div>
      </section>
    </main>
  );
}
