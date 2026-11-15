import { Star, ExternalLink } from "lucide-react";

const REVIEW_URL = "https://share.google/MYCrYzsYsnX4xYZR3";

export function ReviewsBanner() {
  return (
    <section className="mt-10 px-4 sm:mt-14 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-white/40 bg-white/40 p-6 backdrop-blur-xl shadow-[0_30px_70px_-25px_rgba(61,10,23,0.55),0_10px_25px_-12px_rgba(122,24,49,0.35),inset_0_1px_0_rgba(255,255,255,0.65)] sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-yellow-badge/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-wine/40 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-1 text-yellow-badge drop-shadow-[0_4px_10px_rgba(242,183,53,0.5)]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-7 w-7 fill-current sm:h-9 sm:w-9" />
            ))}
          </div>
          <h3 className="text-2xl font-extrabold text-wine-deep sm:text-4xl">
            Gostou do Mineiro? Conta pra gente no Google!
          </h3>
          <p className="max-w-xl text-sm font-medium text-wine-deep/80 sm:text-base">
            Sua avaliação ajuda muito nosso trabalho e mostra o carinho de Abaeté pelo nosso lanche. 💛
          </p>
          <a
            href={REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-wine px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-warm-white shadow-[0_15px_35px_-15px_rgba(71,10,24,0.7)] backdrop-blur transition hover:bg-wine-dark sm:text-base"
          >
            Avaliar no Google <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}