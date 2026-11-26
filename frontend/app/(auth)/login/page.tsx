'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Compass } from 'lucide-react';
import AuthVisual from '@/components/AuthVisual';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      await api.login({ email, password });
      router.replace('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to log in');
    } finally { setLoading(false); }
  }

  return (
    <main className="auth-shell">
      <AuthVisual />
      <section className="form-panel">
        <div className="form-wrap">
          <div className="mb-10 flex items-center gap-3 md:hidden">
            <div className="brand-mark">G</div><span className="font-bold tracking-widest">GANTAVYA</span>
          </div>
          <div className="mb-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><Compass size={22}/></div>
            <p className="text-sm font-semibold text-emerald-800">WELCOME BACK</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to Gantavya</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Pick up where your next adventure begins.</p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <div><label className="mb-2 block text-sm font-semibold" htmlFor="email">Email address</label><input className="field" id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div><div className="mb-2 flex justify-between"><label className="text-sm font-semibold" htmlFor="password">Password</label><span className="text-xs text-slate-400">Keep it secure</span></div><div className="relative"><input className="field pr-12" id="password" type={show?'text':'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required /><button type="button" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{show?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></div>
            {error && <div role="alert" className="error-box">{error}</div>}
            <button className="primary-btn" disabled={loading}>{loading?'Signing you in…':'Sign in'}</button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-500">New to Gantavya? <Link className="subtle-link" href="/signup">Create an account</Link></p>
          <p className="mt-12 text-center text-xs text-slate-400">By continuing, you agree to use Gantavya responsibly.</p>
        </div>
      </section>
    </main>
  );
}
