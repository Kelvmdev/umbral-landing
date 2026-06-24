import { cookies } from "next/headers";
import { tokenValido, COOKIE } from "@/lib/auth";
import { propiedades } from "@/lib/propiedades";
import { sitio } from "@/lib/sitio";
import LoginForm from "./LoginForm";
import PanelAdmin from "./PanelAdmin";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const jar = await cookies();
  const autenticado = tokenValido(jar.get(COOKIE)?.value);

  if (!autenticado) return <LoginForm />;

  return <PanelAdmin propiedadesIniciales={propiedades} sitioInicial={sitio} />;
}
