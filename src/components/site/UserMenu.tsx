import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Legacy localStorage helpers (kept for CartDrawer fallback when signed out)
export const ORDERS_KEY = "mineiro-orders-v1";
export const ADDRESSES_KEY = "mineiro-addresses-v1";

type OrderRecord = {
  id: string;
  date: string;
  total: number;
  items: { name: string; qty: number }[];
  address?: string;
};

export function readOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; }
}
export function readAddresses(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(ADDRESSES_KEY) || "[]"); } catch { return []; }
}
export function saveOrder(o: OrderRecord) {
  const list = readOrders();
  list.unshift(o);
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(list.slice(0, 20)));
}
export function saveAddress(a: string) {
  const list = readAddresses();
  const clean = a.trim();
  if (!clean) return;
  const dedup = [clean, ...list.filter((x) => x !== clean)].slice(0, 5);
  window.localStorage.setItem(ADDRESSES_KEY, JSON.stringify(dedup));
}

export function UserMenu() {
  const { user } = useAuth();
  const to = user ? "/conta" : "/auth";
  return (
    <Link
      to={to}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-warm-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:bg-white/20 hover:text-caramel"
      aria-label={user ? "Minha conta" : "Entrar"}
    >
      <User className="h-5 w-5" />
    </Link>
  );
}