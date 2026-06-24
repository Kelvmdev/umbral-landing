import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";
import { sitio } from "@/lib/sitio";

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
  title: {
    default: "Umbral — donde empieza el hogar",
    template: "%s · Umbral",
  },
  description:
    "Catálogo de propiedades en venta y arriendo. Cruza el umbral hacia tu próximo hogar.",
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
