import pecaAgora from "@/assets/banners/peca-agora.png.asset.json";

export function DiscountBanner() {
  return (
    <section className="mt-10 px-4 sm:mt-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <a
          href="#cardapio"
          className="group relative block overflow-hidden rounded-3xl shadow-card sm:rounded-[32px]"
        >
          <img
            src={pecaAgora.url}
            alt="Peça agora — Mineiro Lanches"
            className="block w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Glass shine */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl border border-white/20 sm:rounded-[32px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl"
          />
        </a>
      </div>
    </section>
  );
}