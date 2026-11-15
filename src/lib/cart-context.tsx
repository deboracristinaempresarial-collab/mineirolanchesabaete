import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { Product } from "@/data/menu";
import { additionals as ALL_ADDITIONALS } from "@/data/menu";

export type CartAdditional = { id: string; qty: number };

export type CartItem = {
  key: string;
  product: Product;
  quantity: number;
  option?: string;
  additionals: CartAdditional[];
  notes?: string;
};

export type DeliveryType = "entrega" | "retirada";
export type PaymentType = "dinheiro" | "pix" | "cartao";

export type CheckoutInfo = {
  deliveryType: DeliveryType;
  name: string;
  address: string;
  neighborhood?: string;
  reference?: string;
  payment: PaymentType;
  changeFor?: string;
  deliveryFee?: number;
  orderNotes?: string;
};

type State = { items: CartItem[]; open: boolean };
type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; key: string }
  | { type: "qty"; key: string; delta: number }
  | { type: "bumpAdd"; key: string; addId: string; delta: number }
  | { type: "clear" }
  | { type: "open"; open: boolean }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "mineiro-cart-v3";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, items: action.items };
    case "add": {
      const existing = state.items.find((i) => i.key === action.item.key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === action.item.key ? { ...i, quantity: i.quantity + action.item.quantity } : i,
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.key !== action.key) };
    case "qty":
      return {
        ...state,
        items: state.items.flatMap((i) => {
          if (i.key !== action.key) return [i];
          const q = i.quantity + action.delta;
          return q <= 0 ? [] : [{ ...i, quantity: q }];
        }),
      };
    case "bumpAdd":
      return {
        ...state,
        items: state.items.map((i) => {
          if (i.key !== action.key) return i;
          const cur = i.additionals.find((a) => a.id === action.addId);
          const nextQty = Math.max(0, (cur?.qty ?? 0) + action.delta);
          let next: CartAdditional[];
          if (nextQty === 0) {
            next = i.additionals.filter((a) => a.id !== action.addId);
          } else if (cur) {
            next = i.additionals.map((a) => (a.id === action.addId ? { ...a, qty: nextQty } : a));
          } else {
            next = [...i.additionals, { id: action.addId, qty: nextQty }];
          }
          return { ...i, additionals: next };
        }),
      };
    case "clear":
      return { ...state, items: [] };
    case "open":
      return { ...state, open: action.open };
  }
}

type Ctx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (
    p: Product,
    opts?: { quantity?: number; option?: string; additionals?: CartAdditional[]; notes?: string },
  ) => void;
  removeItem: (key: string) => void;
  changeQty: (key: string, delta: number) => void;
  bumpAddOnItem: (key: string, addId: string, delta: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  buildWhatsappUrl: (info: CheckoutInfo) => string;
  lineTotal: (item: CartItem) => number;
};

const CartCtx = createContext<Ctx | null>(null);

const WHATSAPP_NUMBER = "5537998701093";

function formatBRL(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

function paymentLabel(p: PaymentType) {
  return p === "dinheiro" ? "Dinheiro" : p === "pix" ? "Pix" : "Cartão";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items, hydrated]);

  const value = useMemo<Ctx>(() => {
    const lineTotal = (i: CartItem) => {
      const addsPrice = i.additionals.reduce(
        (s, a) => s + (ALL_ADDITIONALS.find((x) => x.id === a.id)?.price ?? 0) * a.qty,
        0,
      );
      return (i.product.price + addsPrice) * i.quantity;
    };

    const count = state.items.reduce((a, i) => a + i.quantity, 0);
    const subtotal = state.items.reduce((a, i) => a + lineTotal(i), 0);

    const buildWhatsappUrl = (info: CheckoutInfo) => {
      const emojiFor = (cat: string) => {
        switch (cat) {
          case "artesanais": return "🍔";
          case "tradicionais": return "🍞";
          case "fritas": return "🍟";
          case "diversos": return "🍽️";
          case "bebidas": return "🥤";
          default: return "🍔";
        }
      };
      const addEmoji = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes("cebola")) return "🧅";
        if (n.includes("ovo")) return "🥚";
        if (n.includes("bacon")) return "🥓";
        if (n.includes("queijo") || n.includes("mussarela") || n.includes("cheddar") || n.includes("catupiry")) return "🧀";
        if (n.includes("presunto")) return "🍖";
        if (n.includes("calabresa")) return "🌭";
        if (n.includes("picles")) return "🥒";
        if (n.includes("molho")) return "🥫";
        if (n.includes("bife") || n.includes("smash") || n.includes("hambúrguer")) return "🍔";
        return "➕";
      };
      const lines: string[] = [];
      lines.push("🍔 *NOVO PEDIDO - Mineiro Lanches*", "");
      lines.push("📋 *Detalhes do Pedido*", "");
      state.items.forEach((i) => {
        const opt = i.option ? ` (${i.option})` : "";
        lines.push(`${emojiFor(i.product.category)} ${i.quantity}x ${i.product.name}${opt} — 💰 ${formatBRL(lineTotal(i))}`);
        const adds = i.additionals
          .map((a) => {
            const info = ALL_ADDITIONALS.find((x) => x.id === a.id);
            return info ? `   • ${addEmoji(info.name)} ${a.qty}x ${info.name}` : null;
          })
          .filter(Boolean) as string[];
        if (adds.length) {
          lines.push("   ➕ Adicionais:");
          lines.push(...adds);
        }
        if (i.notes) lines.push(`   📝 Obs: ${i.notes}`);
        lines.push("");
      });
      const fee = info.deliveryType === "entrega" ? info.deliveryFee ?? 0 : 0;
      lines.push(`💵 Subtotal: ${formatBRL(subtotal)}`);
      if (fee > 0) lines.push(`🛵 Taxa de entrega: ${formatBRL(fee)}`);
      lines.push(`✅ *Valor Total: ${formatBRL(subtotal + fee)}*`, "");
      lines.push("👤 *Dados do Cliente*", "");
      lines.push(`${info.deliveryType === "entrega" ? "🛵" : "🏪"} Tipo: ${info.deliveryType === "entrega" ? "Entrega" : "Retirada no Local"}`);
      lines.push(`🙋 Nome: ${info.name}`);
      if (info.deliveryType === "entrega" && info.address) {
        lines.push(`📍 Rua/Nº: ${info.address}`);
        if (info.neighborhood) lines.push(`🏘️ Bairro: ${info.neighborhood}`);
        if (info.reference) lines.push(`📌 Ponto de referência: ${info.reference}`);
      }
      let pay = paymentLabel(info.payment);
      if (info.payment === "dinheiro" && info.changeFor && info.changeFor.trim()) {
        pay += ` (Troco para ${info.changeFor})`;
      }
      const payEmoji = info.payment === "pix" ? "💳" : info.payment === "cartao" ? "💳" : "💵";
      lines.push(`${payEmoji} Pagamento: ${pay}`);
      if (info.orderNotes && info.orderNotes.trim()) {
        lines.push("", `📝 *Observação:* ${info.orderNotes.trim()}`);
      }
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    };


    return {
      items: state.items,
      open: state.open,
      setOpen: (v) => dispatch({ type: "open", open: v }),
      addItem: (p, opts) => {
        const addsArr = (opts?.additionals ?? []).filter((a) => a.qty > 0);
        const addsKey = [...addsArr]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((a) => `${a.id}:${a.qty}`)
          .join(",");
        const key = [p.id, opts?.option ?? "", addsKey, opts?.notes ?? ""].join("|");
        dispatch({
          type: "add",
          item: {
            key,
            product: p,
            quantity: opts?.quantity ?? 1,
            option: opts?.option,
            additionals: addsArr,
            notes: opts?.notes,
          },
        });
      },
      removeItem: (key) => dispatch({ type: "remove", key }),
      changeQty: (key, delta) => dispatch({ type: "qty", key, delta }),
      bumpAddOnItem: (key, addId, delta) => dispatch({ type: "bumpAdd", key, addId, delta }),
      clear: () => dispatch({ type: "clear" }),
      count,
      subtotal,
      buildWhatsappUrl,
      lineTotal,
    };
  }, [state]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}