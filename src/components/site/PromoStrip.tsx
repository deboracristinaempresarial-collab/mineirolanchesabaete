import satisfacao from "@/assets/banners/banner-satisfacao.jpg.asset.json";
import club from "@/assets/banners/banner-club.jpg.asset.json";
import instagram from "@/assets/banners/banner-instagram.jpg.asset.json";

const glassWrap =
  "relative mx-auto max-w-7xl rounded-[28px] border border-white/40 bg-white/40 p-2 backdrop-blur-xl shadow-[0_30px_70px_-25px_rgba(61,10,23,0.55),0_10px_25px_-12px_rgba(122,24,49,0.35),inset_0_1px_0_rgba(255,255,255,0.65)]";
const imgClass = "block h-auto w-full rounded-[22px] object-cover";

export function SatisfacaoBanner() {
  return (
    <section className="mt-10 px-4 sm:mt-14 sm:px-6">
      <div className={glassWrap}>
        <img src={satisfacao.url} alt="É muito mais que sabor, é satisfação" className={imgClass} loading="lazy" />
      </div>
    </section>
  );
}

export function ClubBanner() {
  return (
    <section className="mt-10 px-4 sm:mt-14 sm:px-6">
      <div className={glassWrap}>
        <img src={club.url} alt="Club Mi Lanches — muitas promoções e novidades" className={imgClass} loading="lazy" />
      </div>
    </section>
  );
}

export function InstagramBanner() {
  return (
    <section className="mt-10 px-4 sm:mt-14 sm:px-6">
      <a
        href="https://instagram.com/mineirolanchesabaete"
        target="_blank"
        rel="noreferrer"
        className={`${glassWrap} block transition hover:brightness-105`}
      >
        <img src={instagram.url} alt="Siga no Instagram @mineirolanchesabaete" className={imgClass} loading="lazy" />
      </a>
    </section>
  );
}