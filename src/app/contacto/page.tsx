import Image from "next/image";

const instagramPreview = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&h=900&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&h=900&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&h=900&q=80",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&h=900&q=80",
  "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=900&h=900&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&h=900&q=80",
];

export default function ContactoPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-8 py-20 sm:py-24">
      <section className="space-y-14 border border-white/10 bg-neutral-900/20 p-10 sm:p-14">
        <div className="space-y-5 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-neutral-100 sm:text-6xl">
            Hablemos
          </h1>
          <p className="text-neutral-300/90">
            Escribeme y te respondo con una propuesta a medida para tu sesion.
          </p>
        </div>

        <div className="space-y-4 text-center text-lg">
          <a
            href="mailto:efpitarque@gmail.com"
            className="block text-neutral-100 transition hover:text-neutral-300"
          >
            efpitarque@gmail.com
          </a>
          <a
            href="https://www.instagram.com/photopartner.studio"
            target="_blank"
            rel="noreferrer"
            className="block text-neutral-100 transition hover:text-neutral-300"
          >
            @photopartner.studio
          </a>
        </div>

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-neutral-100">Instagram</h2>

          {/* Cuando conectemos la API real, esta grilla se llenara con los ultimos posts en vez de estas imagenes de prueba. */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {instagramPreview.map((imageUrl, index) => (
              <div
                key={`instagram-preview-${index}`}
                className="relative aspect-square overflow-hidden border border-white/10"
              >
                <Image
                  src={imageUrl}
                  alt={`Preview Instagram ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <a
            href="https://www.instagram.com/photopartner.studio"
            target="_blank"
            rel="noreferrer"
            className="btn-premium"
          >
            Ver más en Instagram
          </a>
        </section>
      </section>
    </main>
  );
}
