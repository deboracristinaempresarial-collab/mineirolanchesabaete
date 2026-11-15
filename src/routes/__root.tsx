import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart-context";
import { AuthProvider } from "../lib/auth-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-wine">404</h1>
        <h2 className="mt-4 text-xl font-bold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-wine px-6 py-3 text-sm font-semibold text-warm-white transition hover:bg-wine-dark">
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-foreground">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte para o início.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-warm-white hover:bg-wine-dark"
          >
            Tentar novamente
          </button>
          <a href="/" className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mineiro Lanches Abaeté" },
      { name: "description", content: "Hambúrgueres artesanais, tradicionais, porções e macarrão feitos com carinho. Delivery rápido em Abaeté/MG. Peça pelo WhatsApp!" },
      { name: "keywords", content: "hambúrguer Abaeté, lanche Abaeté, delivery Abaeté, hambúrguer artesanal, mineiro lanches, comida Abaeté MG, porções, batata frita, smash burger" },
      { name: "author", content: "Mineiro Lanches" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "Mineiro Lanches" },
      { property: "og:title", content: "Mineiro Lanches Abaeté" },
      { property: "og:description", content: "Hambúrgueres artesanais, tradicionais, porções e macarrão feitos com carinho. Delivery rápido em Abaeté/MG. Peça pelo WhatsApp!" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Mineiro Lanches Abaeté" },
      { name: "twitter:description", content: "Hambúrgueres artesanais, tradicionais, porções e macarrão feitos com carinho. Delivery rápido em Abaeté/MG. Peça pelo WhatsApp!" },
      { name: "theme-color", content: "#74162D" },
      { name: "geo.region", content: "BR-MG" },
      { name: "geo.placename", content: "Abaeté" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Mineiro Lanches",
          image: "/icon-512.png",
          description: "Hambúrgueres artesanais, lanches tradicionais, porções e delivery em Abaeté/MG.",
          servesCuisine: ["Hambúrguer", "Brasileira", "Lanches"],
          priceRange: "$$",
          telephone: "+55 37 99870-1093",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Avenida Joaquina do Pompeu, 968",
            addressLocality: "Abaeté",
            addressRegion: "MG",
            addressCountry: "BR",
          },
          openingHours: "Mo-Su 17:30-23:30",
          acceptsReservations: "False",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}