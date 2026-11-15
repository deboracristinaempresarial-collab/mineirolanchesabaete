import { useEffect, useRef, useState } from "react";

const STATS = [
  { end: 7, suffix: "", label: "Anos fazendo história" },
  { end: 2000, suffix: "+", label: "Pedidos entregues" },
  { end: 100, suffix: "%", label: "Satisfação garantida" },
];

function useCountUp(end: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration]);
  return value;
}

function Stat({ end, suffix, label, active }: { end: number; suffix: string; label: string; active: boolean }) {
  const v = useCountUp(end, active);
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 px-3 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_45px_-25px_rgba(0,0,0,0.6)] backdrop-blur-md sm:px-4 sm:py-6">
      <p className="font-display flex items-baseline justify-center gap-0.5 whitespace-nowrap text-3xl font-black leading-none tracking-tight text-warm-white sm:text-4xl">
        <span>{v.toLocaleString("pt-BR")}</span>
        <span className="text-2xl text-caramel sm:text-3xl">{suffix}</span>
      </p>
      <p className="font-display mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-warm-white/85 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

export function ExperienceCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(true),
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className="mt-10 px-4 sm:mt-14 sm:px-6">
      <div className="gradient-wine mx-auto max-w-7xl overflow-hidden rounded-[28px] p-8 sm:p-12">
        <p className="font-display text-center text-xs font-semibold uppercase tracking-[0.32em] text-caramel">
          Nossa jornada
        </p>
        <h2 className="font-display mt-2 text-center text-3xl font-black tracking-tight text-warm-white sm:text-4xl">
          Tempo de experiência
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}