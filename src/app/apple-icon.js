import { ImageResponse } from "next/og";

// Icono para "Añadir a pantalla de inicio" en iOS (no lee SVG; necesita PNG).
// Mismo motivo de arco/umbral que icon.svg, generado por código.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d1813",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path
            d="M10 24 V15 a6 6 0 0 1 12 0 V24"
            fill="none"
            stroke="#cf7048"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
