export function LocationSection() {
  return (
    <section id="localizacao" className="mt-12 px-4 sm:mt-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h2 className="title-underline text-3xl font-extrabold text-wine-deep sm:text-4xl">
            Venha nos visitar em Abaeté 📍
          </h2>
        </div>
        <div className="relative rounded-[28px] border border-white/40 bg-white/40 p-2 backdrop-blur-xl shadow-[0_30px_70px_-25px_rgba(61,10,23,0.55),0_10px_25px_-12px_rgba(122,24,49,0.35),inset_0_1px_0_rgba(255,255,255,0.65)]">
          <div className="overflow-hidden rounded-[22px]">
            <iframe
              title="Mineiro Lanches em Abaeté"
              src="https://www.google.com/maps?q=Avenida+Joaquina+do+Pompeu+968+Abaete+MG&output=embed"
              className="block h-[360px] w-full border-0 sm:h-[440px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}