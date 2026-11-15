import { useEffect, useState } from "react";
import { Download, Share, Plus, X } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "mineiro-pwa-dismissed-v1";

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Already installed?
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as any).standalone === true;
    if (standalone) return;
    if (window.localStorage.getItem(DISMISS_KEY)) return;

    const ua = window.navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    if (isIos) {
      // Delay a bit to not jump on first paint
      const t = setTimeout(() => {
        setShowIos(true);
        setVisible(true);
      }, 1200);
      return () => {
        window.removeEventListener("beforeinstallprompt", onBip);
        clearTimeout(t);
      };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 z-[60] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-96">
      <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-4 shadow-[0_20px_50px_-15px_rgba(61,10,23,0.55),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl">
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-coffee/60 hover:bg-cream hover:text-wine"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-wine text-warm-white shadow-md">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1 pr-6">
            <p className="text-sm font-extrabold text-wine-deep">Instalar Mineiro Lanches</p>
            {showIos ? (
              <p className="mt-1 text-[11px] leading-snug text-coffee/80">
                No iPhone: toque em <Share className="mx-0.5 inline h-3 w-3 -translate-y-0.5" /> Compartilhar e
                depois <b>“Adicionar à Tela de Início”</b> <Plus className="mx-0.5 inline h-3 w-3 -translate-y-0.5" />.
              </p>
            ) : (
              <p className="mt-1 text-[11px] leading-snug text-coffee/80">
                Adicione o app na tela inicial para pedir mais rápido, sem abrir o navegador.
              </p>
            )}
            {!showIos && deferred && (
              <button
                onClick={install}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-wine px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-warm-white shadow hover:bg-wine-dark"
              >
                <Download className="h-3.5 w-3.5" /> Instalar app
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}