import Link from "next/link";

const navegacion = [
  { href: "/#propiedades", texto: "Propiedades" },
  { href: "/#ubicacion", texto: "Ubicación" },
  { href: "/#contacto", texto: "Contacto" },
];

const redes = [
  { href: "https://instagram.com", texto: "Instagram" },
  { href: "https://facebook.com", texto: "Facebook" },
  { href: "https://wa.me/573000000000", texto: "WhatsApp" },
];

export default function Footer() {
  const año = 2026; // ponytail: fijo; si importa, new Date().getFullYear() en cliente

  return (
    <footer className="mt-[8%] border-t border-linea bg-papel-3">
      <div className="mx-auto grid max-w-7xl gap-[2.5rem] px-[6%] py-[4rem] sm:grid-cols-2 lg:grid-cols-4 lg:px-[4%]">
        {/* Marca + tagline */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-2xl font-semibold text-tinta">Umbral</p>
          <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-tenue">
            Donde empieza el hogar. Catálogo de propiedades en venta y arriendo.
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
              <a href="tel:+573000000000" className="transition-colors hover:text-arcilla">
                +57 300 000 0000
              </a>
            </li>
            <li>
              <a href="mailto:hola@umbral.co" className="transition-colors hover:text-arcilla">
                hola@umbral.co
              </a>
            </li>
            <li>Medellín, Colombia</li>
          </ul>
        </div>

        {/* Redes */}
        <nav aria-label="Redes sociales">
          <h2 className="font-body text-xs uppercase tracking-[0.2em] text-tenue">
            Síguenos
          </h2>
          <ul className="mt-4 space-y-2">
            {redes.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-tinta-suave transition-colors hover:text-arcilla"
                >
                  {r.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-linea">
        <p className="mx-auto max-w-7xl px-[6%] py-5 font-body text-xs text-tenue lg:px-[4%]">
          © {año} Umbral. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
