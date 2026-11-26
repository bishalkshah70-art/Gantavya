'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Map, CalendarDays, LogOut, Mountain, MapPin } from 'lucide-react';
import { api, User } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        let result;
        try { result = await api.me(); }
        catch { await api.refresh(); result = await api.me(); }
        if (active) setUser(result.user);
      } catch { router.replace('/login'); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [router]);

  async function logout() {
    await api.logout().catch(()=>undefined);
    router.replace('/login');
  }

  if (loading) return <main className="min-h-screen grid place-items-center text-slate-500">Loading your journey…</main>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3"><div className="brand-mark">G</div><div><div className="font-bold tracking-widest">GANTAVYA</div><div className="text-[10px] tracking-[.2em] text-slate-400">YOUR NEPAL JOURNEY</div></div></div>
          <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"><LogOut size={16}/> Sign out</button>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold tracking-widest text-emerald-800">YOUR DASHBOARD</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Namaste, {user.fullName.split(' ')[0]} <span>👋</span></h1>
        <p className="mt-3 text-slate-500">Your next destination is waiting to be discovered.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Compass, title: 'Explore destinations', desc: 'Find places worth travelling for.' },
            { icon: Map, title: 'Plan an itinerary', desc: 'Shape your route and trip duration.' },
            { icon: CalendarDays, title: 'Your bookings', desc: 'Keep your travel details together.' },
          ].map(item => <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><item.icon size={21}/></div><h2 className="font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p><span className="mt-5 inline-block text-xs font-bold uppercase tracking-wider text-emerald-800">Coming soon</span></div>)}
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl bg-[#173e36] p-8 text-white md:p-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div><p className="text-sm font-semibold tracking-widest text-emerald-200">A LITTLE INSPIRATION</p><h2 className="mt-3 max-w-xl text-3xl font-semibold">Take the scenic route. Make the story yours.</h2><p className="mt-3 text-sm text-white/70">Gantavya is being built to bring your Nepal travel planning into one place.</p></div>
            <Mountain className="h-24 w-24 text-emerald-200/80"/>
          </div>
        </div>
        <p className="mt-8 flex items-center gap-2 text-xs text-slate-400"><MapPin size={13}/> Signed in as {user.email} · {user.role}</p>
      </section>
    </main>
  );
}
