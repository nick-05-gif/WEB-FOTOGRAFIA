import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudio Fotográfico",
  description: "Portfolio profesional de fotografía artística y comercial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-neutral-950 text-neutral-50 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
