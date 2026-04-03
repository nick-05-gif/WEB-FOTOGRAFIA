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
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <section className="space-y-10 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-100">Hablemos</h1>
          <p className="text-neutral-300">
            Escribeme y te respondo con una propuesta a medida para tu sesion.
          </p>
        </div>

        <div className="space-y-3 text-center text-lg">
          <a
            href="mailto:efpitarque@gmail.com"
            className="block text-blue-400 transition hover:text-blue-300"
          >
            efpitarque@gmail.com
          </a>
          <a
            href="https://www.instagram.com/photopartner.studio"
            target="_blank"
            rel="noreferrer"
            className="block text-blue-400 transition hover:text-blue-300"
          >
            @photopartner.studio
          </a>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-100">Instagram</h2>

          {/* Cuando conectemos la API real, esta grilla se llenara con los ultimos posts en vez de estas imagenes de prueba. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {instagramPreview.map((imageUrl, index) => (
              <div
                key={`instagram-preview-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border border-neutral-800"
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
            className="inline-flex rounded-md bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Ver más en Instagram
          </a>
        </section>
      </section>
    </main>
  );
}
