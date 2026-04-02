export function Footer() {
  return (
    <footer
      id="contacto"
      className="border-t border-white/10 bg-neutral-950/80 backdrop-blur px-6 py-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright {new Date().getFullYear()} PhotoPartner Studio</p>

        <div className="flex items-center gap-4">
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
      </div>
    </footer>
  );
}
