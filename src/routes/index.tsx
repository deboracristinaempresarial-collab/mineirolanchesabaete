import { createFileRoute } from "@tanstack/react-router";
import { seoUrl } from "@/lib/seo";
import { useState } from "react";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroBanner } from "@/components/site/HeroBanner";
import { CategoryStrip } from "@/components/site/CategoryStrip";
import { TrustBand } from "@/components/site/TrustBand";
import { BenefitsStrip } from "@/components/site/BenefitsStrip";
import { MenuSection } from "@/components/site/MenuSection";
import { SatisfacaoBanner, ClubBanner, InstagramBanner } from "@/components/site/PromoStrip";
import { ExperienceCounter } from "@/components/site/ExperienceCounter";
import { DiscountBanner } from "@/components/site/DiscountBanner";
import { VideoSection } from "@/components/site/VideoSection";
import { LocationSection } from "@/components/site/LocationSection";
import { ReviewsBanner } from "@/components/site/ReviewsBanner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CartDrawer } from "@/components/site/CartDrawer";
import { MobileBottomBar } from "@/components/site/MobileBottomBar";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { PwaInstallPrompt } from "@/components/site/PwaInstallPrompt";

import { useEffect } from "react";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Mineiro Lanches Abaeté" },
      { name: "description", content: "Hambúrgueres artesanais, tradicionais, porções e macarrão feitos com carinho. Delivery rápido em Abaeté/MG. Peça pelo WhatsApp!" },
      { property: "og:title", content: "Mineiro Lanches Abaeté" },
      { property: "og:description", content: "Hambúrgueres artesanais, tradicionais, porções e macarrão feitos com carinho. Delivery rápido em Abaeté/MG. Peça pelo WhatsApp!" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: seoUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/b334672b-5c7b-4aaf-ac25-ce3a20e01867" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/b334672b-5c7b-4aaf-ac25-ce3a20e01867" },
    ],
    links: [{ rel: "canonical", href: seoUrl("/") }],
  }),
  component: Index,
});

function Index() {
  const [category, setCategory] = useState<string>("destaques");

  const handleCategory = (c: string) => {
    setCategory(c);
    setTimeout(() => {
      document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Anti-copy protections
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F12") e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && ["u", "s", "c", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-24 lg:pb-8 select-none">
      <SiteHeader onCategoryClick={handleCategory} />
      <main>
        <HeroBanner />
        <CategoryStrip onSelect={handleCategory} />
        <DiscountBanner />
        <MenuSection activeCategory={category} onCategoryChange={setCategory} />
        <SatisfacaoBanner />
        <TrustBand />
        <BenefitsStrip />
        <VideoSection />
        <ClubBanner />
        <ExperienceCounter />
        <InstagramBanner />
        <ReviewsBanner />
        <LocationSection />
      </main>
      <SiteFooter />
      <CartDrawer />
      <MobileBottomBar />
      <WhatsAppFloat />
      <PwaInstallPrompt />

      <Toaster position="top-center" richColors />
    </div>
  );
}