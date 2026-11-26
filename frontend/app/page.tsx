import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="brand-mark mx-auto mb-5">G</div>
        <p className="text-sm font-bold tracking-[.22em] uppercase text-emerald-800">Gantavya · Nepal</p>
        <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight">Your next story starts <span className="text-emerald-800">here.</span></h1>
        <p className="mt-5 text-slate-600 leading-7">Discover remarkable places, plan thoughtful journeys, and make every destination count.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link className="primary-btn !w-auto" href="/signup">Create account</Link>
          <Link className="rounded-xl border border-slate-300 px-5 py-3 font-semibold" href="/login">Log in</Link>
        </div>
      </div>
    </main>
  );
}
