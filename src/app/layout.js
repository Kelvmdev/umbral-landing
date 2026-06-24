import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";

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

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${hanken.variable}`}>
      <body className="min-h-screen antialiased">
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
