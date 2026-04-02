export default function ContactoPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <section className="space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-100">Hablemos</h1>

        <div className="space-y-4 text-lg">
          <a
            href="mailto:contacto@photopartner.studio"
            className="block text-blue-400 transition hover:text-blue-300"
          >
            contacto@photopartner.studio
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
      </section>
    </main>
  );
}
