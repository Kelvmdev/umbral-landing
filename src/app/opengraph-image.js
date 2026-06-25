import { ImageResponse } from "next/og";
import { sitio } from "@/lib/sitio";

// Imagen que se ve al compartir el sitio en redes/WhatsApp. Generada por código
// (next/og) con la paleta cálida de la marca — sin subir ningún PNG.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Umbral — donde empieza el hogar";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#e0d3ba",
          color: "#1d1813",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#6b6052",
          }}
        >
          Umbral
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 28,
          }}
        >
          <span>Cruza el umbral hacia</span>
          <span>tu próximo hogar</span>
        </div>
        <div style={{ fontSize: 34, color: "#b1502b", marginTop: 40 }}>
          Venta y arriendo · Medellín y el Valle de Aburrá
        </div>
      </div>
    ),
    size
  );
}
