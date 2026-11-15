import { Home, ShoppingBag, Search, Moon, Sun, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

const INSTAGRAM_URL = "https://www.instagram.com/mineirolanches/";

function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

export function MobileBottomBar() {
  const { setOpen } = useCart();
  const { dark, toggle } = useTheme();

  const tabs = [
    { icon: Home, label: "Início", onClick: () => document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" }) },
    { icon: ShoppingBag, label: "Cardápio", onClick: () => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" }) },
    { icon: Instagram, label: "Instagram", onClick: () => window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer") },
    { icon: Search, label: "Pesquisa", onClick: () => setOpen(true) },
    { icon: dark ? Sun : Moon, label: dark ? "Padrão" : "Escuro", onClick: toggle },
  ];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="rounded-[28px] border border-white/50 bg-white/40 px-2 py-2 shadow-[0_20px_50px_-15px_rgba(61,10,23,0.55),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
        <div className="flex items-stretch justify-around">
          {tabs.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-semibold text-wine-deep transition hover:bg-white/40 hover:text-wine dark:hover:bg-white/10"
            >
              <Icon className="h-5 w-5 text-wine" strokeWidth={2.2} />
              <span className="leading-none">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}