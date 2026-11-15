import catHamburguer from "@/assets/banners/cat-hamburguer.png.asset.json";
import catArtesanal from "@/assets/banners/cat-artesanal.png.asset.json";
import catMacarrao from "@/assets/banners/cat-macarrao.png.asset.json";
import catPernil from "@/assets/banners/cat-pernil.png.asset.json";
import catPorcoes1 from "@/assets/banners/cat-porcoes1.png.asset.json";
import catPorcoes2 from "@/assets/banners/cat-porcoes2.png.asset.json";
import catOmelete from "@/assets/banners/cat-omelete.png.asset.json";

const CATEGORIES = [
  { key: "tradicionais", label: "Hambúrguer", image: catHamburguer.url },
  { key: "artesanais", label: "Artesanal", image: catArtesanal.url },
  { key: "diversos", label: "Macarrão", image: catMacarrao.url },
  { key: "diversos", label: "Pão c/ Pernil", image: catPernil.url },
  { key: "fritas", label: "Porções", image: catPorcoes1.url },
  { key: "fritas", label: "Fritas", image: catPorcoes2.url },
  { key: "diversos", label: "Omelete", image: catOmelete.url },
];

export function CategoryStrip({ onSelect }: { onSelect: (c: string) => void }) {
  const items = [...CATEGORIES, ...CATEGORIES];
  return (
    <section className="mt-8 px-4 sm:mt-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="title-underline mb-5 text-3xl font-extrabold text-wine-deep sm:text-4xl">
          Destaques <span>🤤🔥</span>
        </h2>

        <div
          className="-mx-4 overflow-x-auto no-scrollbar touch-pan-x group/marquee"
        >
          <div className="flex w-max animate-marquee gap-2 pb-4 group-hover/marquee:[animation-play-state:paused] group-active/marquee:[animation-play-state:paused] sm:gap-4">
            {items.map((c, idx) => (
              <button
                key={`${c.label}-${idx}`}
                onClick={() => {
                  onSelect(c.key);
                  setTimeout(() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" }), 50);
                }}
                className="group relative shrink-0"
                aria-label={c.label}
              >
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  className="h-24 w-24 object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03] sm:h-40 sm:w-40"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}