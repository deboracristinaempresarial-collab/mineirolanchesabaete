import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { products, formatPrice } from "@/data/menu";
import { toast } from "sonner";
import {
  ArrowLeft, LogOut, User as UserIcon, Package, MapPin, Heart,
  RotateCcw, Trash2, Save,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/conta")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Minha conta — Mineiro Lanches Abaeté" },
      { name: "description", content: "Área privada do cliente do Mineiro Lanches Abaeté." },
      { property: "og:title", content: "Minha conta — Mineiro Lanches Abaeté" },
      { property: "og:description", content: "Área privada do cliente do Mineiro Lanches Abaeté." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: ContaPage,
});

type Order = {
  id: string;
  total: number;
  items: { product_id?: string; name: string; qty: number }[];
  delivery_type: string | null;
  address: string | null;
  payment: string | null;
  created_at: string;
};

type Address = {
  id: string;
  street: string;
  neighborhood: string | null;
  reference: string | null;
};



function ContaPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { addItem, setOpen: openCart } = useCart();
  const [tab, setTab] = useState<"perfil" | "pedidos" | "enderecos" | "favoritos">("perfil");


  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [newAddr, setNewAddr] = useState({ street: "", neighborhood: "", reference: "" });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, o, a, f] = await Promise.all([
        supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
        supabase.from("user_orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("user_addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("user_favorites").select("product_id").eq("user_id", user.id),
      ]);
      if (p.data) setProfile({ full_name: p.data.full_name || "", phone: p.data.phone || "" });
      if (o.data) setOrders(o.data as unknown as Order[]);
      if (a.data) setAddresses(a.data as Address[]);
      if (f.data) setFavorites(f.data.map((x: any) => x.product_id));
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      updated_at: new Date().toISOString(),
    });
    setSavingProfile(false);
    if (error) toast.error(error.message);
    else toast.success("Perfil atualizado");
  };

  const repeatOrder = (o: Order) => {
    let added = 0;
    o.items.forEach((it) => {
      const prod = products.find((p) => p.id === it.product_id || p.name === it.name);
      if (prod) {
        addItem(prod, { quantity: it.qty });
        added++;
      }
    });
    if (added === 0) toast.error("Não foi possível repetir esse pedido");
    else {
      toast.success(`${added} item(ns) adicionado(s)`);
      openCart(true);
      navigate({ to: "/" });
    }
  };

  const addAddress = async () => {
    if (!user || !newAddr.street.trim()) return;
    const { data, error } = await supabase.from("user_addresses").insert({
      user_id: user.id,
      street: newAddr.street.trim(),
      neighborhood: newAddr.neighborhood.trim() || null,
      reference: newAddr.reference.trim() || null,
    }).select().single();
    if (error) return toast.error(error.message);
    if (data) setAddresses([data as Address, ...addresses]);
    setNewAddr({ street: "", neighborhood: "", reference: "" });
    toast.success("Endereço salvo");
  };

  const delAddress = async (id: string) => {
    await supabase.from("user_addresses").delete().eq("id", id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const removeFav = async (pid: string) => {
    if (!user) return;
    await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("product_id", pid);
    setFavorites(favorites.filter((x) => x !== pid));
  };

  const favProducts = products.filter((p) => favorites.includes(p.id));


  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-warm-white to-cream pb-20">
      <header className="gradient-wine sticky top-0 z-10 px-4 py-4 shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-warm-white/90 hover:text-caramel">
            <ArrowLeft className="h-4 w-4" /> Início
          </Link>
          <h1 className="text-lg font-extrabold text-warm-white">Minha conta</h1>
          <button
            onClick={() => { signOut(); navigate({ to: "/" }); }}
            className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-warm-white hover:bg-white/20"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-5">
        {/* Tabs */}
        <div className="mb-4 flex gap-1 overflow-x-auto rounded-full border border-border bg-white/60 p-1 backdrop-blur">
          {[
            { k: "perfil", label: "Perfil", icon: UserIcon },
            { k: "pedidos", label: "Pedidos", icon: Package },
            { k: "enderecos", label: "Endereços", icon: MapPin },
            { k: "favoritos", label: "Favoritos", icon: Heart },
          ].map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              onClick={() => setTab(k as any)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition ${
                tab === k ? "bg-wine text-warm-white shadow" : "text-wine-deep hover:bg-cream"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>


        {tab === "perfil" && (
          <Card>
            <p className="mb-3 text-xs font-bold uppercase text-wine-deep">Dados pessoais</p>
            <div className="space-y-3">
              <Input label="Nome completo" value={profile.full_name} onChange={(v) => setProfile({ ...profile, full_name: v })} />
              <Input label="Telefone / WhatsApp" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
              <Input label="E-mail" value={user?.email || ""} onChange={() => {}} disabled />
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-wine px-4 py-2.5 text-sm font-bold text-warm-white hover:bg-wine-dark disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Salvar
              </button>
            </div>
          </Card>
        )}

        {tab === "pedidos" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <Card><p className="text-sm text-coffee/70">Você ainda não tem pedidos.</p></Card>
            ) : orders.map((o) => (
              <Card key={o.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold text-coffee/60">
                      {new Date(o.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="mt-1 text-sm font-bold text-wine-deep">
                      {o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                    </p>
                    {o.address && <p className="mt-1 text-[11px] text-coffee/70">📍 {o.address}</p>}
                  </div>
                  <p className="shrink-0 text-lg font-extrabold text-wine">{formatPrice(o.total)}</p>
                </div>
                <button
                  onClick={() => repeatOrder(o)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-wine bg-white px-4 py-2 text-xs font-bold uppercase text-wine hover:bg-wine hover:text-warm-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Repetir pedido
                </button>
              </Card>
            ))}
          </div>
        )}




        {tab === "enderecos" && (
          <div className="space-y-3">
            <Card>
              <p className="mb-3 text-xs font-bold uppercase text-wine-deep">Novo endereço</p>
              <div className="space-y-2">
                <Input label="Rua e nº" value={newAddr.street} onChange={(v) => setNewAddr({ ...newAddr, street: v })} />
                <Input label="Bairro" value={newAddr.neighborhood} onChange={(v) => setNewAddr({ ...newAddr, neighborhood: v })} />
                <Input label="Referência" value={newAddr.reference} onChange={(v) => setNewAddr({ ...newAddr, reference: v })} />
                <button onClick={addAddress} className="w-full rounded-xl bg-wine px-4 py-2 text-sm font-bold text-warm-white hover:bg-wine-dark">
                  Adicionar
                </button>
              </div>
            </Card>
            {addresses.map((a) => (
              <Card key={a.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-wine-deep">{a.street}</p>
                    {a.neighborhood && <p className="text-xs text-coffee/70">Bairro: {a.neighborhood}</p>}
                    {a.reference && <p className="text-xs text-coffee/60 italic">Ref: {a.reference}</p>}
                  </div>
                  <button onClick={() => delAddress(a.id)} className="text-coffee/50 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "favoritos" && (
          <div className="space-y-3">
            {favProducts.length === 0 ? (
              <Card><p className="text-sm text-coffee/70">Você ainda não favoritou nenhum lanche.</p></Card>
            ) : favProducts.map((p) => (
              <Card key={p.id}>
                <div className="flex items-center gap-3">
                  {p.image && <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-wine-deep">{p.name}</p>
                    <p className="text-xs font-extrabold text-wine">{formatPrice(p.price)}</p>
                  </div>
                  <button
                    onClick={() => { addItem(p, { quantity: 1 }); toast.success("Adicionado"); openCart(true); }}
                    className="rounded-full bg-wine px-3 py-1.5 text-[10px] font-bold uppercase text-warm-white hover:bg-wine-dark"
                  >
                    Pedir
                  </button>
                  <button onClick={() => removeFav(p.id)} className="text-coffee/50 hover:text-destructive">
                    <Heart className="h-4 w-4" fill="currentColor" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-md backdrop-blur">
      {children}
    </div>
  );
}

function Input({
  label, value, onChange, disabled,
}: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-coffee/70">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-border bg-warm-white px-3 py-2 text-sm text-ink outline-none focus:border-wine disabled:bg-cream/50 disabled:text-coffee/60"
      />
    </div>
  );
}