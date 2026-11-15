import { formatPrice, type Product } from "@/data/menu";
import { ShoppingBag, Flame, Camera } from "lucide-react";

export function ProductCard({ product, onOpen, featured = false }: { product: Product; onOpen: (p: Product) => void; featured?: boolean }) {
  const handleQuickAdd = () => onOpen(product);
  const oldPrice = product.price * 1.05;

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-[28px] border border-white/40 bg-white/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-[0_25px_60px_-20px_rgba(61,10,23,0.45),0_10px_25px_-12px_rgba(122,24,49,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] hover:shadow-[0_35px_80px_-20px_rgba(61,10,23,0.55),0_15px_35px_-12px_rgba(122,24,49,0.45),inset_0_1px_0_rgba(255,255,255,0.7)] ${featured ? "ring-2 ring-wine/60" : ""}`}>
      {featured && (
        <span className="absolute right-4 top-4 z-30 rounded-full bg-wine px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-warm-white shadow-md">
          Destaque da semana
        </span>
      )}
      {/* Glass sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent"
      />
      {/* Yellow badge */}
      <span className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-full border border-white/60 bg-yellow-badge/90 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-wine-deep shadow-md backdrop-blur">
        {product.badge ?? "IRRESISTÍVEL"} <Flame className="h-3.5 w-3.5 text-orange-burn" fill="currentColor" />
      </span>

      {/* Image / gray fallback */}
      <button
        onClick={() => onOpen(product)}
        className="relative block aspect-square w-full overflow-hidden"
        aria-label={`Ver ${product.name}`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400 p-6 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-6 rounded-3xl border border-white/50 bg-white/30 backdrop-blur-sm"
            />
            <span className="relative z-10 text-lg font-extrabold uppercase tracking-wide text-neutral-700">
              {product.name}
            </span>
          </div>
        )}
        {product.image && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-wine-deep"
              style={{ clipPath: "polygon(0 40%, 45% 100%, 0 100%)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-wine-deep"
              style={{ clipPath: "polygon(55% 0, 100% 0, 100% 60%)" }}
            />
          </>
        )}
        <span className="absolute bottom-3 left-3 z-10 rounded border border-white/30 bg-wine-deep/85 px-2 py-0.5 text-[10px] font-bold uppercase text-warm-white backdrop-blur">
          Entrega Rápida
        </span>
        {product.image && (
          <span
            title="Foto meramente ilustrativa"
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full border border-white/40 bg-black/45 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-warm-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            <Camera className="h-3 w-3" /> Foto ilustrativa
          </span>
        )}
      </button>

      {/* Body */}
      <div className="relative flex flex-1 flex-col p-5">
        <h3 className="text-base font-extrabold leading-tight text-wine-deep sm:text-lg">
          {product.name} 🍔
        </h3>
        {product.ingredients && (
          <p className="mt-1 line-clamp-3 text-sm font-medium text-wine-deep/85">
            {product.ingredients}
          </p>
        )}

        <div className="mt-4">
          <p className="text-sm font-semibold text-coffee/50 line-through">
            {formatPrice(oldPrice)}
          </p>
          <p className="text-2xl font-extrabold text-wine">{formatPrice(product.price)}</p>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/60 px-3 text-sm font-extrabold text-wine-deep shadow-sm backdrop-blur"
            >
              1+
            </span>
            <button
              onClick={handleQuickAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/30 bg-wine px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-warm-white shadow-md backdrop-blur transition hover:bg-wine-dark"
            >
              <ShoppingBag className="h-4 w-4" /> Pedir agora
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}