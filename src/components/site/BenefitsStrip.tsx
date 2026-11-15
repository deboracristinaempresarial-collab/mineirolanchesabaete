import { Bike, Award, ChefHat } from "lucide-react";

const BENEFITS = [
  {
    icon: Bike,
    title: "Entrega em toda cidade.",
    desc: "Entregamos seu lanche com cuidado e compromisso.",
  },
  {
    icon: Award,
    title: "Melhor da região.",
    desc: "Sabor autêntico mineiro que conquistou Abaeté.",
  },
  {
    icon: ChefHat,
    title: "Feito com carinho.",
    desc: "Ingredientes selecionados e produção artesanal.",
  },
];

export function BenefitsStrip() {
  return (
    <section className="mt-10 px-4 sm:mt-14 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-4 rounded-3xl bg-warm-white p-5 shadow-soft sm:gap-6 sm:p-6"
          >
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-white/40 text-wine shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_25px_-12px_rgba(122,24,49,0.55)] backdrop-blur-md sm:h-16 sm:w-16">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold leading-tight text-wine-deep sm:text-xl">{title}</h3>
              <p className="mt-1 text-sm font-semibold text-coffee/75 sm:text-base">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}