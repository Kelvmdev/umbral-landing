import Link from "next/link";

// Navegación = estructura del sitio (no contenido editable)
const navegacion = [
  { href: "/#propiedades", texto: "Propiedades" },
  { href: "/#ubicacion", texto: "Ubicación" },
  { href: "/#faq", texto: "Preguntas" },
  { href: "/#contacto", texto: "Contacto" },
];

export default function Footer({ sitio }) {
  const { marca, contacto, redes } = sitio;
  const año = new Date().getFullYear();

  return (
    <footer className="mt-[8%] border-t border-linea bg-papel-3">
      <div className="mx-auto grid max-w-7xl gap-[2.5rem] px-[6%] py-[4rem] sm:grid-cols-2 lg:grid-cols-4 lg:px-[4%]">
        {/* Marca + tagline */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-2xl font-semibold text-tinta">
            {marca.nombre}
          </p>
          <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-tenue">
            {marca.tagline.charAt(0).toUpperCase() + marca.tagline.slice(1)}.
            Catálogo de propiedades en venta y arriendo.
          </p>
        </div>

        {/* Navegación */}
        <nav aria-label="Enlaces del pie">
          <h2 className="font-body text-xs uppercase tracking-[0.2em] text-tenue">
            Navegación
          </h2>
          <ul className="mt-4 space-y-2">
            {navegacion.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  className="font-body text-sm text-tinta-suave transition-colors hover:text-arcilla"
                >
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto */}
        <div>
          <h2 className="font-body text-xs uppercase tracking-[0.2em] text-tenue">
            Contacto
          </h2>
          <ul className="mt-4 space-y-2 font-body text-sm text-tinta-suave">
            <li>
              <a href={`tel:${contacto.tel}`} className="transition-colors hover:text-arcilla">
                {contacto.tel}
              </a>
            </li>
            <li>
              <a href={`mailto:${contacto.email}`} className="transition-colors hover:text-arcilla">
                {contacto.email}
              </a>
            </li>
            <li>{contacto.ciudad}</li>
          </ul>
        </div>

        {/* Redes */}
        <nav aria-label="Redes sociales">
          <h2 className="font-body text-xs uppercase tracking-[0.2em] text-tenue">
            Síguenos
          </h2>
          <ul className="mt-4 space-y-2">
            {redes.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-tinta-suave transition-colors hover:text-arcilla"
                >
                  {r.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-linea">
        <p className="mx-auto max-w-7xl px-[6%] py-5 font-body text-xs text-tenue lg:px-[4%]">
          © {año} {marca.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
