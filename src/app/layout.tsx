import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SITE_URL } from "@/lib/site";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["500", "600", "700"],
});

// Colega, si quieres cambiar la previsualizacion de WhatsApp/Twitter,
// cambia SOLO esta linea por tu logo o foto final.
const DEFAULT_SHARE_IMAGE_URL =
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1600&h=900&q=80";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ruben | Fotografo Profesional",
  description:
    "Fotografo profesional para bodas, retratos y proyectos editoriales. Reserva tu sesion y transforma tu idea en imagenes de alto impacto.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Ruben Fotografia",
    title: "Ruben | Fotografo Profesional",
    description:
      "Fotografo profesional para bodas, retratos y proyectos editoriales. Reserva tu sesion y transforma tu idea en imagenes de alto impacto.",
    images: [
      {
        url: DEFAULT_SHARE_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Portada del portfolio de Ruben Fotografia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruben | Fotografo Profesional",
    description:
      "Fotografo profesional para bodas, retratos y proyectos editoriales. Reserva tu sesion y transforma tu idea en imagenes de alto impacto.",
    images: [DEFAULT_SHARE_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
