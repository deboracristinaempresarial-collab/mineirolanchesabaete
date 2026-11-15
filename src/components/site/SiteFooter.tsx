import { Instagram } from "lucide-react";
import logoAsset from "@/assets/mineiro-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer id="contato" className="mt-16 px-3 sm:mt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="gradient-footer relative overflow-hidden rounded-[32px] border border-white/10 p-8 text-warm-white sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 rounded-full bg-caramel/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-wine/40 blur-3xl" />
          <div className="relative grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <img src={logoAsset.url} alt="Mineiro Lanches" className="h-16 w-auto" />
              <p className="mt-4 max-w-sm text-sm text-warm-white/80">
                O verdadeiro sabor mineiro em cada mordida. Hambúrgueres artesanais e tradicionais feitos com carinho em Abaeté/MG.
              </p>
              <a
                href="https://instagram.com/mineirolanchesabaete"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-warm-white/10 px-4 py-2 text-sm font-semibold hover:bg-warm-white/20"
              >
                <Instagram className="h-4 w-4" /> @mineirolanchesabaete
              </a>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-caramel">Cardápio</h4>
              <ul className="mt-4 space-y-2 text-sm text-warm-white/80">
                <li><a href="#cardapio" className="hover:text-caramel">Artesanais</a></li>
                <li><a href="#cardapio" className="hover:text-caramel">Tradicionais</a></li>
                <li><a href="#cardapio" className="hover:text-caramel">Fritas</a></li>
                <li><a href="#cardapio" className="hover:text-caramel">Bebidas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-caramel">Horário</h4>
              <ul className="mt-4 space-y-3 text-sm text-warm-white/80">
                <li>Seg a Ter · Qui a Dom</li>
                <li className="font-semibold text-warm-white">17h30 às 23h</li>
              </ul>
            </div>
          </div>
          <div className="relative mt-10 flex flex-col items-start justify-between gap-3 border-t border-warm-white/10 pt-6 text-xs text-warm-white/60 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Mineiro Lanches Abaeté. Todos os direitos reservados.</p>
            <p>Feito com sabor em Minas Gerais.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}