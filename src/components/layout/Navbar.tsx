const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur-md">
      <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <a
          href="#inicio"
          className="text-base font-semibold tracking-wide text-neutral-100 transition-colors hover:text-blue-300"
        >
          PhotoPartner <span className="text-blue-500">Studio</span>
        </a>

        <ul className="flex items-center gap-6 text-sm text-neutral-300">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="transition-colors hover:text-blue-400"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
