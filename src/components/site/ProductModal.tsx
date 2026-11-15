import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { additionals, formatPrice, type Product } from "@/data/menu";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart, type CartAdditional } from "@/lib/cart-context";
import { toast } from "sonner";

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem, setOpen: setCartOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [option, setOption] = useState<string | undefined>();
  const [addQty, setAddQty] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (product) {
      setQty(1);
      setOption(product.options?.values[0]);
      setAddQty({});
      setNotes("");
    }
  }, [product]);

  const addsTotal = useMemo(
    () =>
      Object.entries(addQty).reduce(
        (s, [id, q]) => s + (additionals.find((a) => a.id === id)?.price ?? 0) * q,
        0,
      ),
    [addQty],
  );
  const total = product ? (product.price + addsTotal) * qty : 0;

  if (!product) return null;

  const bumpAdd = (id: string, delta: number) =>
    setAddQty((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });

  const handleAdd = () => {
    if (product.options && !option) {
      toast.error("Selecione um sabor antes de adicionar.");
      return;
    }
    const addsArr: CartAdditional[] = Object.entries(addQty)
      .filter(([, q]) => q > 0)
      .map(([id, qty]) => ({ id, qty }));
    addItem(product, { quantity: qty, option, additionals: addsArr, notes: notes.trim() || undefined });
    toast.success(`${product.name} adicionado ao carrinho`);
    onClose();
    setTimeout(() => setCartOpen(true), 150);
  };

  return (
    <Dialog open={!!product} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-3xl bg-warm-white p-0 text-ink">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl bg-gradient-to-br from-wine to-wine-deep">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover burger-glow" />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <span className="text-3xl font-extrabold uppercase tracking-wide text-warm-white">
                {product.name}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-warm-white to-transparent" />
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-wine-deep">{product.name}</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-sm text-coffee/80">{product.description}</p>
          {product.ingredients && (
            <p className="mt-3 rounded-2xl bg-cream/60 p-3 text-sm text-coffee">
              <span className="font-semibold text-wine">Ingredientes:</span> {product.ingredients}
            </p>
          )}

          {product.options && (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-wine">{product.options.label} *</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.options.values.map((v) => (
                  <button
                    key={v}
                    onClick={() => setOption(v)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      option === v ? "bg-wine text-warm-white" : "border border-wine/20 bg-warm-white text-wine hover:bg-cream"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.category !== "bebidas" && (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-wine">Adicionais (escolha a quantidade)</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {additionals.map((a) => {
                  const q = addQty[a.id] ?? 0;
                  const active = q > 0;
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        active ? "border-wine bg-wine/5" : "border-border bg-warm-white"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-coffee">{a.name}</p>
                        <p className="text-[11px] font-bold text-wine">+{formatPrice(a.price)}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-wine/20 bg-warm-white p-0.5">
                        <button
                          onClick={() => bumpAdd(a.id, -1)}
                          disabled={q === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-cream text-wine disabled:opacity-40"
                          aria-label={`Diminuir ${a.name}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-5 text-center text-xs font-bold text-wine">{q}</span>
                        <button
                          onClick={() => bumpAdd(a.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-wine text-warm-white"
                          aria-label={`Aumentar ${a.name}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5">
            <label className="text-xs font-bold uppercase tracking-wider text-wine">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: sem cebola, ponto da carne, etc."
              className="mt-2 w-full rounded-2xl border border-border bg-warm-white p-3 text-sm text-ink outline-none focus:border-wine"
            />
          </div>

          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-full border border-border bg-warm-white p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-wine">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-6 text-center text-sm font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-wine text-warm-white">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-between gap-3 rounded-full bg-wine px-6 py-3.5 text-sm font-bold text-warm-white shadow-[0_15px_35px_-15px_rgba(71,10,24,0.7)] hover:bg-wine-dark"
            >
              <span>Adicionar ao carrinho</span>
              <span>{formatPrice(total)}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}