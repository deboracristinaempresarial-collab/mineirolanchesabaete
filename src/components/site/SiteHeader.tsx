import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/mineiro-logo.png.asset.json";
import topBarAsset from "@/assets/banners/top-bar-v3.jpg.asset.json";
import { useCart } from "@/lib/cart-context";
import { UserMenu } from "@/components/site/UserMenu";

const NAV = [
  { label: "Início", cat: "" },
  { label: "Artesanais", cat: "artesanais" },
  { label: "Tradicionais", cat: "tradicionais" },
  { label: "Fritas", cat: "fritas" },
  { label: "Diversos", cat: "diversos" },
  { label: "Bebidas", cat: "bebidas" },
];

export function SiteHeader({ onCategoryClick }: { onCategoryClick?: (c: string) => void }) {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-card">
      {/* Top bar image — thin strip, full width */}
      <div className="relative h-8 w-full overflow-hidden bg-wine-deep sm:h-10">
        <img
          src={topBarAsset.url}
          alt="Campeões em sabor · Líder em qualidade"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* Header pill */}
      <div className="relative px-2 pt-3 sm:px-4 sm:pt-4 pb-3">
        <div className="relative mx-auto max-w-7xl">
          <div className="gradient-header relative overflow-hidden rounded-full border border-white/10 px-3 py-2 shadow-[0_20px_50px_-20px_rgba(122,24,49,0.9)] sm:px-5 sm:py-2.5">

            {/* Radial glow accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,24,49,0.55),transparent_65%)]"
            />
            <div className="relative flex items-center gap-3">
              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-warm-white hover:bg-white/10 lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Logo centered on mobile, left on desktop */}
              <Link
                to="/"
                className="mx-auto flex shrink-0 items-center lg:mx-0"
                aria-label="Mineiro Lanches"
              >
                <img
                  src={logoAsset.url}
                  alt="Mineiro Lanches"
                  className="h-11 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:h-14"
                  width={512}
                  height={128}
                />
              </Link>

              {/* Desktop nav */}
              <nav className="mx-auto hidden items-center gap-1 lg:flex">
                {NAV.map((n) => (
                  <button
                    key={n.label}
                    onClick={() => {
                      if (n.cat) onCategoryClick?.(n.cat);
                      else document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide text-warm-white/90 transition hover:bg-white/10 hover:text-caramel"
                  >
                    {n.label}
                  </button>
                ))}
                <a
                  href="#localizacao"
                  className="rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide text-warm-white/90 transition hover:bg-white/10 hover:text-caramel"
                >
                  Localização
                </a>
              </nav>

              {/* Right icons */}
              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-warm-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:bg-white/20 hover:text-caramel"
                  aria-label="Buscar"
                  onClick={() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Search className="h-5 w-5" />
                </button>
                <UserMenu />
                <button
                  onClick={() => setOpen(true)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-warm-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:bg-white/20 hover:text-caramel"
                  aria-label="Carrinho"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1 text-[10px] font-bold text-warm-white ring-2 ring-black/40">
                    {count}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile drop */}
          {mobileOpen && (
            <div className="mt-2 rounded-3xl bg-wine-deep p-3 shadow-card lg:hidden">
              <div className="grid grid-cols-2 gap-1">
                {NAV.map((n) => (
                  <button
                    key={n.label}
                    onClick={() => {
                      setMobileOpen(false);
                      if (n.cat) onCategoryClick?.(n.cat);
                      else document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-warm-white/90 hover:bg-white/10 hover:text-caramel"
                  >
                    {n.label}
                  </button>
                ))}
                <a
                  href="#localizacao"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-warm-white/90 hover:bg-white/10 hover:text-caramel"
                >
                  Localização
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}