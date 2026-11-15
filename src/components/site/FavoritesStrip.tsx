import { Flame, Sparkles, Users, ChefHat, Utensils, GlassWater } from "lucide-react";

const FAVS = [
  { icon: Flame, title: "Mais pedido", cat: "destaques" },
  { icon: ChefHat, title: "Artesanal", cat: "artesanais" },
  { icon: Sparkles, title: "Tradicional", cat: "tradicionais" },
  { icon: Users, title: "Para compartilhar", cat: "diversos" },
  { icon: Utensils, title: "Fritas", cat: "fritas" },
  { icon: GlassWater, title: "Bebidas", cat: "bebidas" },
];

export function FavoritesStrip({ onSelect }: { onSelect: (c: string) => void }) {
  return (
    <section className="px-3 sm:px-6 mt-10 sm:mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-caramel">Destaques</p>
            <h2 className="mt-2 text-3xl font-extrabold text-wine-deep sm:text-4xl">Os favoritos de Abaeté</h2>
            <p className="mt-2 max-w-xl text-sm text-coffee/80">
              Escolha seu lanche e prepare-se para uma experiência irresistível.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FAVS.map(({ icon: Icon, title, cat }) => (
            <button
              key={title}
              onClick={() => {
                onSelect(cat);
                document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-wine/10 bg-warm-white p-5 text-center shadow-soft transition hover:-translate-y-1 hover:border-wine/30 hover:shadow-card"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-wine text-warm-white transition group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-wine-deep">{title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}