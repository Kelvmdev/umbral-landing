// Inyecta datos estructurados (JSON-LD) para Google y las IA.
// Server component: el <script> sale en el HTML inicial, sin JS de cliente.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
