import { Play } from "lucide-react";
import { useState } from "react";
import cover from "@/assets/banners/youtube-cover.jpg.asset.json";

const YOUTUBE_ID = "HsgGxQlGyqU";

export function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="mt-12 px-4 sm:mt-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-wine-deep sm:text-4xl">
            Os melhores lanches e delivery rápido em Abaeté 🍔🍟🔥
          </h2>
        </div>

        <div className="overflow-hidden rounded-[24px] bg-warm-white p-2 shadow-card">
          <div className="relative aspect-video overflow-hidden rounded-[20px] bg-black">
            {playing ? (
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
                title="Mineiro Lanches"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 flex items-center justify-center"
                aria-label="Reproduzir vídeo"
              >
                <img
                  src={cover.url}
                  alt="Mineiro Lanches — Entregador"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-wine text-warm-white shadow-[0_15px_40px_-10px_rgba(122,24,49,0.8)] transition group-hover:scale-110 sm:h-24 sm:w-24">
                  <Play className="ml-1 h-8 w-8 sm:h-10 sm:w-10" fill="currentColor" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}