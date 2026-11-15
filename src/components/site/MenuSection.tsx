import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories as allCategories, products as allProducts, type Product, type CategoryKey } from "@/data/menu";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

const categories = allCategories;
const products = allProducts;

const COLLECTION_ORDER: { key: CategoryKey; label: string; tagline: string }[] = [
  { key: "artesanais", label: "Artesanais", tagline: "Smash burgers preparados na chapa com ingredientes selecionados." },
  { key: "tradicionais", label: "Tradicionais", tagline: "Os clássicos que conquistaram Abaeté." },
  { key: "fritas", label: "Fritas & Porções", tagline: "Para acompanhar ou compartilhar." },
  { key: "diversos", label: "Diversos", tagline: "Opções para variar o cardápio." },
  { key: "bebidas", label: "Bebidas", tagline: "Para acompanhar seu pedido, bem gelado." },
];

export function MenuSection({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string;
  onCategoryChange: (c: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<Product | null>(null);

  const q = query.trim().toLowerCase();
  const matches = (p: Product) =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.ingredients ?? "").toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q);

  const filteredFlat = useMemo(() => {
    // Home (destaques) só mostra produtos com foto.
    if (activeCategory === "destaques")
      return products.filter((p) => p.featured && !!p.image && matches(p));
    if (activeCategory !== "todos")
      return products.filter((p) => p.category === activeCategory && matches(p));
    return products.filter(matches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, q]);

  const showCollections = activeCategory === "todos";

  return (
    <section id="cardapio" className="relative mt-12 px-4 sm:mt-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="title-underline text-3xl font-extrabold text-wine-deep sm:text-4xl">
            Pedidos da Semana<span>🔥🍔😋</span>
          </h2>
          <button
            onClick={() => onCategoryChange("todos")}
            className="shrink-0 text-sm font-extrabold text-wine hover:underline sm:text-base"
          >
            Ver todos
          </button>
        </div>

        {/* Sticky filters */}
        <div className="sticky top-[104px] z-30 mb-8 rounded-3xl border border-wine/15 bg-warm-white/95 p-3 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-1">
              {categories.map((c) => {
                const active = activeCategory === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => onCategoryChange(c.key)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
                      active
                        ? "bg-wine text-warm-white shadow-md"
                        : "bg-cream text-wine-deep hover:bg-cream-deep"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
            <div className="relative lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wine" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 60))}
                placeholder="Buscar no cardápio"
                className="w-full rounded-full border border-wine/20 bg-warm-white py-2.5 pl-10 pr-4 text-sm font-medium text-wine-deep placeholder:text-coffee/50 outline-none focus:border-wine"
              />
            </div>
          </div>
        </div>

        {filteredFlat.length === 0 ? (
          <div className="rounded-3xl bg-warm-white p-12 text-center text-sm font-semibold text-coffee/70 shadow-soft">
            Nenhum produto encontrado{query ? ` para "${query}"` : ""}.
          </div>
        ) : showCollections ? (
          <div className="space-y-14">
            {COLLECTION_ORDER.map((col) => {
              const list = filteredFlat.filter((p) => p.category === col.key);
              if (list.length === 0) return null;
              return (
                <div key={col.key}>
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b-2 border-wine/25 pb-3">
                    <div>
                      <h3 className="text-2xl font-extrabold uppercase text-wine-deep sm:text-3xl">
                        {col.label}
                      </h3>
                      <p className="text-sm text-coffee/75">{col.tagline}</p>
                    </div>
                    <span className="rounded-full bg-wine/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-wine">
                      {list.length} {list.length === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((p) => (
                      <ProductCard key={p.id} product={p} onOpen={setModal} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFlat.map((p, i) => (
              <div key={p.id} className={i === 0 ? "sm:col-span-2 lg:col-span-3" : ""}>
                <ProductCard product={p} onOpen={setModal} featured={i === 0} />
              </div>
            ))}
          </div>
        )}
      </div>
      <ProductModal product={modal} onClose={() => setModal(null)} />
    </section>
  );
}