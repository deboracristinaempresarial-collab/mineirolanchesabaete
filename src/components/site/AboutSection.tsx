import institutional from "@/assets/institutional.jpg";
import logoAsset from "@/assets/mineiro-logo.png.asset.json";

export function AboutSection() {
  return (
    <section id="sobre" className="px-3 sm:px-6 mt-16 sm:mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-3xl bg-cream p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="relative overflow-hidden rounded-[28px]">
            <img src={institutional} alt="Cozinha da Mineiro Lanches em Abaeté" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-wine-deep/25" />
          </div>
          <div>
            <img src={logoAsset.url} alt="Mineiro Lanches" className="h-14 w-auto" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-caramel">Nossa história</p>
            <h2 className="mt-2 text-3xl font-extrabold text-wine-deep sm:text-4xl">
              Uma hamburgueria mineira com alma de casa.
            </h2>
            <p className="mt-4 text-sm text-coffee/85 leading-relaxed">
              A Mineiro Lanches nasceu em Abaeté com uma missão simples: entregar o verdadeiro sabor mineiro em cada lanche. Do smash artesanal ao X-Mineiro generoso, cada pedido é feito com ingredientes selecionados, muito capricho e aquele toque caseiro que só a gente sabe fazer.
            </p>
            <p className="mt-3 text-sm text-coffee/85 leading-relaxed">
              Aqui, sabor autêntico não é promessa — é tradição, garantida em toda mordida.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { n: "+591", l: "Clientes felizes" },
                { n: "10+", l: "Anos de sabor" },
                { n: "5★", l: "Avaliação Google" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-warm-white p-4 text-center">
                  <p className="text-2xl font-extrabold text-wine">{s.n}</p>
                  <p className="text-[11px] font-semibold text-coffee/70">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}