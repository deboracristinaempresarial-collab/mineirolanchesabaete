import { Trophy } from "lucide-react";

const ITEMS = Array.from({ length: 6 });

export function TrustBand() {
  return (
    <section className="gradient-wine relative mt-6 overflow-hidden py-6 sm:mt-8 sm:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,134,61,0.15),transparent_60%)]"
      />
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8">
          {ITEMS.map((_, i) => (
            <div key={`a-${i}`} className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-warm-white sm:text-3xl md:text-4xl">
                O melhor de Abaeté e Região
              </span>
              <Trophy className="h-7 w-7 text-yellow-badge sm:h-9 sm:w-9" fill="currentColor" />
            </div>
          ))}
        </div>
        <div aria-hidden className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8">
          {ITEMS.map((_, i) => (
            <div key={`b-${i}`} className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-warm-white sm:text-3xl md:text-4xl">
                O melhor de Abaeté e Região
              </span>
              <Trophy className="h-7 w-7 text-yellow-badge sm:h-9 sm:w-9" fill="currentColor" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}