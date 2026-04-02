interface HeroSectionProps {
  imageUrl?: string;
}

export function HeroSection({ imageUrl }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden"
    >
      {imageUrl ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,0.2),transparent_50%),linear-gradient(135deg,#020617_0%,#0a0a0a_55%,#0b1c3f_100%)]"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/60 to-neutral-950"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-neutral-100 sm:text-6xl">
          Capturando el mundo a través de la luz
        </h1>

        <a
          href="#contacto"
          className="mt-10 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-500"
        >
          Pedir presupuesto a medida
        </a>
      </div>
    </section>
  );
}
