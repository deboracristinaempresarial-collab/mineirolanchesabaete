import seConecte from "@/assets/banners/se-conecte.jpg.asset.json";

export function HeroBanner() {
  return (
    <section id="inicio" className="px-0 pt-4 sm:px-4 sm:pt-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden sm:rounded-[24px]">
          <img
            src={seConecte.url}
            alt="Se conecte com Mineiro Lanches"
            className="h-auto w-full object-cover"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </section>
  );
}