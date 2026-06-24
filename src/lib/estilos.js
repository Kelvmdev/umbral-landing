// Estilos de botón compartidos. Mismo "efecto" que las tarjetas:
// se elevan un poco y proyectan sombra al pasar el mouse.
const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 font-body text-sm font-medium transition duration-300 active:scale-95 hover:-translate-y-0.5";

export const btnPrimario = `${base} bg-tinta text-papel hover:bg-tinta-suave hover:shadow-[0_14px_30px_-12px_rgba(29,24,19,0.55)]`;

export const btnSecundario = `${base} border border-tinta text-tinta hover:bg-papel-2 hover:shadow-[0_14px_30px_-12px_rgba(29,24,19,0.4)]`;

export const btnArcilla = `${base} bg-arcilla text-papel hover:bg-arcilla-honda hover:shadow-[0_14px_30px_-12px_rgba(177,80,43,0.55)]`;
