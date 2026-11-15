import { useEffect, useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart, type DeliveryType, type PaymentType } from "@/lib/cart-context";
import { additionals, formatPrice, products } from "@/data/menu";
import { Minus, Plus, Trash2, MessageCircle, Truck, Store, Banknote, CreditCard, QrCode, MapPin, ChevronDown, ChevronUp, ChevronRight, GlassWater } from "lucide-react";

import { toast } from "sonner";
import { readAddresses, saveAddress, saveOrder } from "@/components/site/UserMenu";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

const DELIVERY_FEE = 6;

export function CartDrawer() {
  const { items, open, setOpen, changeQty, removeItem, subtotal, buildWhatsappUrl, clear, lineTotal, bumpAddOnItem, addItem } = useCart();
  const { user } = useAuth();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("entrega");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [reference, setReference] = useState("");
  const [payment, setPayment] = useState<PaymentType>("pix");
  const [changeFor, setChangeFor] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    (async () => {
      let list: string[] = [];
      // Prefer signed-in user's cloud addresses
      if (user) {
        const { data: prof } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
        if (prof?.full_name && !name.trim()) setName(prof.full_name);
        const { data: addrs } = await supabase.from("user_addresses").select("street, neighborhood, reference").eq("user_id", user.id).order("created_at", { ascending: false });
        if (addrs) list = addrs.map((a: any) => [a.street, a.neighborhood, a.reference && `ref: ${a.reference}`].filter(Boolean).join(" — "));
      }
      if (list.length === 0) list = readAddresses();
      setSavedAddresses(list);
      if (list.length > 0 && !address.trim() && !neighborhood.trim()) {
        const parts = list[0].split(" — ");
        setAddress(parts[0] ?? list[0]);
        setNeighborhood((parts[1] ?? "").replace(/^Bairro:\s*/, ""));
        const ref = parts.find((p) => p.startsWith("ref: "));
        if (ref) setReference(ref.slice(5));
      }
    })();
  }, [open, user]);

  const canSubmit = useMemo(() => {
    if (items.length === 0) return false;
    if (!name.trim()) return false;
    if (deliveryType === "entrega" && (!address.trim() || !neighborhood.trim())) return false;
    return true;
  }, [items.length, name, deliveryType, address, neighborhood]);

  const fee = deliveryType === "entrega" ? DELIVERY_FEE : 0;
  const grandTotal = subtotal + fee;

  const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canSubmit) {
      e.preventDefault();
      if (!name.trim()) toast.error("Informe seu nome");
      else if (deliveryType === "entrega" && !address.trim()) toast.error("Informe a rua e o número");
      else if (deliveryType === "entrega" && !neighborhood.trim()) toast.error("Informe o bairro");
      return;
    }
    // Persist order + address for history (localStorage + Cloud if signed in)
    try {
      if (deliveryType === "entrega" && address.trim()) {
        const full = [address.trim(), neighborhood.trim(), reference.trim() && `ref: ${reference.trim()}`]
          .filter(Boolean)
          .join(" — ");
        saveAddress(full);
      }
      saveOrder({
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        total: grandTotal,
        items: items.map((i) => ({ name: i.product.name, qty: i.quantity })),
        address:
          deliveryType === "entrega"
            ? [address.trim(), neighborhood.trim()].filter(Boolean).join(", ")
            : undefined,
      });
      if (user) {
        void supabase.from("user_orders").insert({
          user_id: user.id,
          total: grandTotal,
          items: items.map((i) => ({ product_id: i.product.id, name: i.product.name, qty: i.quantity })),
          delivery_type: deliveryType,
          address: deliveryType === "entrega" ? [address.trim(), neighborhood.trim()].filter(Boolean).join(", ") : null,
          payment,
          notes: orderNotes.trim() || null,
        });
        if (deliveryType === "entrega" && address.trim()) {
          // Save address to cloud (dedupe by street)
          void supabase.from("user_addresses").select("id").eq("user_id", user.id).eq("street", address.trim()).maybeSingle().then(({ data }) => {
            if (!data) {
              void supabase.from("user_addresses").insert({
                user_id: user.id,
                street: address.trim(),
                neighborhood: neighborhood.trim() || null,
                reference: reference.trim() || null,
              });
            }
          });
        }
      }
    } catch {}
  };

  const whatsappUrl = buildWhatsappUrl({
    deliveryType,
    name: name.trim(),
    address: address.trim(),
    neighborhood: neighborhood.trim(),
    reference: reference.trim(),
    payment,
    changeFor: changeFor.trim(),
    deliveryFee: fee,
    orderNotes: orderNotes.trim(),
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col bg-warm-white p-0 text-ink sm:max-w-md">
        <SheetHeader className="gradient-header border-b border-border px-6 py-4">
          <SheetTitle className="text-lg font-extrabold uppercase tracking-wide text-warm-white">
            Início do pedido
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream text-3xl">🍔</div>
            <p className="text-sm font-semibold text-wine-deep">Seu carrinho está vazio</p>
            <p className="text-xs text-coffee/70">Adicione um lanche para começar seu pedido.</p>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-warm-white hover:bg-wine-dark"
            >
              Ver cardápio
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto bg-warm-white p-5">
              {/* Itens */}
              <div className="space-y-2">
                {items.map((i) => {
                  const addsList = i.additionals
                    .map((a) => {
                      const info = additionals.find((x) => x.id === a.id);
                      return info ? `${a.qty}x ${info.name}` : null;
                    })
                    .filter(Boolean);
                  const isOpen = !!expanded[i.key];
                  return (
                    <div key={i.key} className="flex gap-3 rounded-2xl border border-border bg-warm-white p-3">
                      {i.product.image ? (
                        <img src={i.product.image} alt={i.product.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-wine text-center text-[10px] font-bold uppercase text-warm-white">
                          {i.product.name}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-wine-deep">{i.product.name}</p>
                            {i.option && <p className="text-[11px] font-semibold text-caramel">{i.option}</p>}
                          </div>
                          <button
                            onClick={() => removeItem(i.key)}
                            className="shrink-0 text-coffee/50 hover:text-destructive"
                            aria-label="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {addsList.length > 0 && (
                          <p className="mt-1 line-clamp-2 text-[11px] text-coffee/70">
                            + {addsList.join(", ")}
                          </p>
                        )}
                        {i.notes && <p className="mt-1 line-clamp-1 text-[11px] italic text-coffee/60">"{i.notes}"</p>}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
                            <button
                              onClick={() => changeQty(i.key, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-cream text-wine"
                              aria-label="Diminuir"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-6 text-center text-xs font-bold">{i.quantity}</span>
                            <button
                              onClick={() => changeQty(i.key, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-wine text-warm-white"
                              aria-label="Aumentar"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-extrabold text-wine">{formatPrice(lineTotal(i))}</span>
                        </div>
                        {i.product.category !== "bebidas" && (
                          <>
                            <button
                              type="button"
                              onClick={() => setExpanded((p) => ({ ...p, [i.key]: !isOpen }))}
                              className="mt-2 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-wine hover:text-wine-dark"
                            >
                              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              {isOpen ? "Fechar adicionais" : "Ajustar adicionais"}
                            </button>
                            {isOpen && (
                              <div className="mt-2 grid grid-cols-1 gap-1.5 rounded-xl bg-cream/40 p-2">
                                {additionals.map((a) => {
                                  const q = i.additionals.find((x) => x.id === a.id)?.qty ?? 0;
                                  return (
                                    <div key={a.id} className="flex items-center justify-between gap-2">
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] font-semibold text-wine-deep">{a.name}</p>
                                        <p className="text-[10px] font-bold text-wine">+{formatPrice(a.price)}</p>
                                      </div>
                                      <div className="flex items-center gap-1 rounded-full border border-wine/20 bg-warm-white p-0.5">
                                        <button
                                          onClick={() => bumpAddOnItem(i.key, a.id, -1)}
                                          disabled={q === 0}
                                          className="flex h-6 w-6 items-center justify-center rounded-full bg-cream text-wine disabled:opacity-40"
                                          aria-label={`Diminuir ${a.name}`}
                                        >
                                          <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="min-w-4 text-center text-[11px] font-bold text-wine">{q}</span>
                                        <button
                                          onClick={() => bumpAddOnItem(i.key, a.id, 1)}
                                          className="flex h-6 w-6 items-center justify-center rounded-full bg-wine text-warm-white"
                                          aria-label={`Aumentar ${a.name}`}
                                        >
                                          <Plus className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Adicione uma bebida */}
              <BeverageSuggest onAdd={(p) => { addItem(p, { quantity: 1 }); toast.success(`${p.name} adicionado`); }} />



              {/* Tipo de pedido */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-wine-deep">Tipo de pedido</p>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton
                    active={deliveryType === "entrega"}
                    onClick={() => setDeliveryType("entrega")}
                    icon={<Truck className="h-4 w-4" />}
                    label="Entrega"
                  />
                  <OptionButton
                    active={deliveryType === "retirada"}
                    onClick={() => setDeliveryType("retirada")}
                    icon={<Store className="h-4 w-4" />}
                    label="Retirada"
                  />
                </div>
              </div>

              {/* Dados do cliente */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-wine-deep">
                    Nome *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 80))}
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm text-ink outline-none focus:border-wine"
                  />
                </div>
                {deliveryType === "entrega" && (
                  <div className="space-y-3">
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-wine-deep">
                      Endereço de entrega *
                    </label>
                    {savedAddresses.length > 0 && (
                      <div className="mb-2 space-y-1">
                        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-coffee/70">
                          <MapPin className="h-3 w-3" /> Endereços salvos — toque para usar
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {savedAddresses.map((a) => (
                            <button
                              key={a}
                              type="button"
                              onClick={() => {
                                const parts = a.split(" — ");
                                setAddress(parts[0] ?? a);
                                setNeighborhood((parts[1] ?? "").replace(/^Bairro:\s*/, ""));
                                const ref = parts.find((p) => p.startsWith("ref: "));
                                setReference(ref ? ref.slice(5) : "");
                              }}
                              className="rounded-full border border-border bg-cream/60 px-3 py-1 text-[11px] font-semibold text-wine-deep hover:border-wine"
                            >
                              {a.length > 40 ? `${a.slice(0, 40)}…` : a}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-coffee/70">
                        Rua com Nº *
                      </label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value.slice(0, 120))}
                        placeholder="Ex: Rua das Flores, 123"
                        className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm text-ink outline-none focus:border-wine"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-coffee/70">
                        Bairro *
                      </label>
                      <input
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value.slice(0, 60))}
                        placeholder="Ex: Centro"
                        className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm text-ink outline-none focus:border-wine"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-coffee/70">
                        Ponto de referência
                      </label>
                      <input
                        value={reference}
                        onChange={(e) => setReference(e.target.value.slice(0, 120))}
                        placeholder="Ex: em frente à praça"
                        className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm text-ink outline-none focus:border-wine"
                      />
                    </div>
                    <p className="mt-1 text-[10px] italic text-coffee/60">
                      Você pode alterar o endereço agora ou digitar um novo.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagamento */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-wine-deep">Forma de pagamento</p>
                <div className="grid grid-cols-3 gap-2">
                  <OptionButton
                    active={payment === "dinheiro"}
                    onClick={() => setPayment("dinheiro")}
                    icon={<Banknote className="h-4 w-4" />}
                    label="Dinheiro"
                  />
                  <OptionButton
                    active={payment === "pix"}
                    onClick={() => setPayment("pix")}
                    icon={<QrCode className="h-4 w-4" />}
                    label="Pix"
                  />
                  <OptionButton
                    active={payment === "cartao"}
                    onClick={() => setPayment("cartao")}
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Cartão"
                  />
                </div>
                {payment === "dinheiro" && (
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-wine-deep">
                      Troco para (opcional)
                    </label>
                    <input
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value.slice(0, 20))}
                      placeholder="Ex: R$ 100,00"
                      className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm text-ink outline-none focus:border-wine"
                    />
                  </div>
                )}
              </div>

              {/* Observação do pedido */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-wine-deep">
                  Observação do pedido
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value.slice(0, 300))}
                  placeholder="Ex: sem cebola, ponto da carne, retirar às 20h..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm text-ink outline-none focus:border-wine"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="relative border-t border-border bg-cream/50 p-5">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-9 left-1/2 flex h-8 w-8 -translate-x-1/2 animate-bounce items-center justify-center rounded-full border border-white/60 bg-white/80 text-wine shadow-lg backdrop-blur-md"
              >
                <ChevronDown className="h-5 w-5" />
              </div>
              <div className="mb-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-coffee/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {deliveryType === "entrega" && (
                  <div className="flex items-center justify-between text-xs font-semibold text-coffee/80">
                    <span>Taxa de entrega</span>
                    <span>{formatPrice(fee)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-border pt-1">
                  <span className="text-sm font-semibold text-coffee">Total</span>
                  <span className="text-2xl font-extrabold text-wine">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <a
                href={canSubmit ? whatsappUrl : "#"}
                target={canSubmit ? "_blank" : undefined}
                rel="noreferrer"
                onClick={handleSubmit}
                aria-disabled={!canSubmit}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-wide shadow-[0_15px_35px_-15px_rgba(71,10,24,0.7)] transition ${
                  canSubmit
                    ? "bg-wine text-warm-white hover:bg-wine-dark"
                    : "cursor-not-allowed bg-coffee/30 text-warm-white"
                }`}
              >
                <MessageCircle className="h-4 w-4" /> Finalizar pedido agora
              </a>
              <button
                onClick={clear}
                className="mt-2 w-full text-center text-xs font-semibold text-coffee/60 hover:text-destructive"
              >
                Esvaziar carrinho
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function OptionButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-3 text-xs font-bold uppercase tracking-wide transition ${
        active
          ? "border-wine bg-wine text-warm-white shadow-md"
          : "border-border bg-warm-white text-wine-deep hover:border-wine/50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function BeverageSuggest({ onAdd }: { onAdd: (p: (typeof products)[number]) => void }) {
  const bebidas = products.filter((p) => p.category === "bebidas");
  const scrollerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="rounded-2xl border border-white/50 bg-white/60 p-3 backdrop-blur-xl">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-wine-deep">
        <GlassWater className="h-4 w-4 text-wine" /> Adicione uma bebida
      </p>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="-mx-1 flex gap-2 overflow-x-auto scroll-smooth no-scrollbar touch-pan-x pb-1 pl-1 pr-10"
        >
          {bebidas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onAdd(p)}
              className="flex min-w-[150px] shrink-0 flex-col justify-between rounded-xl border border-wine/15 bg-warm-white/80 p-2.5 text-left transition hover:border-wine hover:bg-warm-white"
            >
              <span className="line-clamp-2 text-[11px] font-bold leading-tight text-wine-deep">{p.name}</span>
              <span className="mt-1 flex items-center justify-between">
                <span className="text-xs font-extrabold text-wine">{formatPrice(p.price)}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wine text-warm-white">
                  <Plus className="h-3 w-3" />
                </span>
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Ver mais bebidas"
          onClick={() => scrollerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
          className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-wine shadow-md backdrop-blur transition hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}