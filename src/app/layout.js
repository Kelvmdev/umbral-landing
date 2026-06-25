import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";
import { sitio } from "@/lib/sitio";
import { SITE_URL } from "@/lib/site";

// Serif editorial con carácter → titulares (la "voz" de la marca)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

// Sans humanista, cálida y legible → cuerpo
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Umbral — donde empieza el hogar",
    template: "%s · Umbral",
  },
  description:
    "Catálogo de propiedades en venta y arriendo. Cruza el umbral hacia tu próximo hogar.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Umbral",
    url: SITE_URL,
    title: "Umbral — donde empieza el hogar",
    description:
      "Catálogo de propiedades en venta y arriendo en Medellín y el Valle de Aburrá.",
  },
  twitter: { card: "summary_large_image" },
};

// Aplica el tema guardado (o el del sistema) ANTES de pintar → sin parpadeo
const scriptTema = `(function(){try{var t=localStorage.getItem('tema');if(t==='oscuro'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${hanken.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: el script de tema y extensiones del navegador
          (p.ej. ColorZilla) cambian atributos → falso hydration mismatch */}
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <Chrome sitio={sitio}>{children}</Chrome>
      </body>
    </html>
  );
}
