import Link from "next/link";

export function Footer() {
  return (
    <footer id="contacto" className="bg-black px-6 py-8 text-neutral-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 text-center text-sm">
        <p>Copyright {new Date().getFullYear()} PhotoPartner Studio</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://www.instagram.com/photopartner.studio"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-blue-400"
          >
            @photopartner.studio
          </a>
          <a
            href="mailto:contacto@photopartner.studio"
            className="transition-colors hover:text-blue-400"
          >
            contacto@photopartner.studio
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/aviso-legal" className="transition-colors hover:text-blue-400">
            Aviso Legal
          </Link>
          <Link href="/privacidad" className="transition-colors hover:text-blue-400">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
