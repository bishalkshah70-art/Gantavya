export default function AuthVisual() {
  return (
    <aside className="visual-panel">
      <div className="absolute z-10 left-10 top-10 flex items-center gap-3">
        <div className="brand-mark !bg-white !text-emerald-900">G</div>
        <div>
          <div className="font-bold tracking-wide">GANTAVYA</div>
          <div className="text-[10px] tracking-[.24em] text-white/75">FIND YOUR WAY</div>
        </div>
      </div>
      <div className="visual-content">
        <div className="mb-5 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs backdrop-blur">✦ Made for journeys in Nepal</div>
        <h2 className="text-4xl md:text-5xl font-semibold leading-[1.12] tracking-tight">The world is wide. Your next destination is closer than you think.</h2>
        <p className="mt-5 max-w-md text-base leading-7 text-white/80">From quiet mountain mornings to vibrant city streets, plan a journey that feels like yours.</p>
        <div className="mt-10 flex items-center gap-3 text-sm text-white/75"><span className="h-px w-10 bg-white/70" /> Discover · Plan · Go</div>
      </div>
    </aside>
  );
}
