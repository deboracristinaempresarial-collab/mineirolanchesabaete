import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon, Phone, ArrowLeft } from "lucide-react";
import logoAsset from "@/assets/mineiro-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Login — Mineiro Lanches Abaeté" },
      { name: "description", content: "Acesso à conta de cliente do Mineiro Lanches Abaeté." },
      { property: "og:title", content: "Login — Mineiro Lanches Abaeté" },
      { property: "og:description", content: "Acesso à conta de cliente do Mineiro Lanches Abaeté." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/conta" });
  }, [loading, user, navigate]);

  const handleGoogle = async () => {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/conta",
    });
    setBusy(false);
    if (res.error) toast.error("Falha ao entrar com Google");
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/conta",
            data: { full_name: name, phone },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Bem-vindo 🎉");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
      navigate({ to: "/conta" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao autenticar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-deep via-wine to-wine-dark px-4 py-8">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-warm-white/80 hover:text-caramel">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="rounded-3xl border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-6 text-center">
            <img src={logoAsset.url} alt="Mineiro Lanches" className="mx-auto h-16" />
            <h1 className="mt-3 text-2xl font-extrabold text-wine-deep">
              {mode === "signin" ? "Entre na sua conta" : "Crie sua conta"}
            </h1>
            <p className="mt-1 text-xs text-coffee/70">
              Salve seus dados, veja histórico e ganhe pontos.
            </p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm transition hover:bg-cream disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-bold uppercase text-coffee/60">ou com e-mail</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <>
                <Field icon={<UserIcon className="h-4 w-4" />} placeholder="Seu nome" value={name} onChange={setName} />
                <Field icon={<Phone className="h-4 w-4" />} placeholder="Telefone (opcional)" value={phone} onChange={setPhone} />
              </>
            )}
            <Field icon={<Mail className="h-4 w-4" />} placeholder="E-mail" type="email" value={email} onChange={setEmail} required />
            <Field icon={<Lock className="h-4 w-4" />} placeholder="Senha (mín. 6 caracteres)" type="password" value={password} onChange={setPassword} required />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-wine px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-warm-white shadow-lg transition hover:bg-wine-dark disabled:opacity-50"
            >
              {busy ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-xs font-semibold text-wine hover:text-wine-dark"
          >
            {mode === "signin" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon, placeholder, type = "text", value, onChange, required,
}: {
  icon: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-coffee/60">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-border bg-warm-white px-10 py-3 text-sm text-ink outline-none focus:border-wine"
      />
    </div>
  );
}