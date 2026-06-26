// Guarda archivos en el repo de GitHub en UN solo commit (Git Data API).
// Por qué: Vercel es de solo lectura → no se puede escribir en disco en prod.
// El navegador nunca ve el token; este código corre solo en el servidor.
//
// Backend dual: con GITHUB_TOKEN commitea a GitHub (prod); sin token, el caller
// usa fs local (dev rápido, sin commits de ruido).
const OWNER = process.env.GITHUB_OWNER || "Kelvmdev";
const REPO = process.env.GITHUB_REPO || "umbral-landing";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

export const usaGitHub = () => Boolean(process.env.GITHUB_TOKEN);

function cabeceras() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "umbral-cms", // GitHub exige User-Agent o responde 403
    "Content-Type": "application/json",
  };
}

async function gh(metodo, ruta, cuerpo) {
  const r = await fetch(`${API}${ruta}`, {
    method: metodo,
    headers: cabeceras(),
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!r.ok) {
    const detalle = await r.text().catch(() => "");
    throw new Error(`GitHub ${metodo} ${ruta} → ${r.status} ${detalle}`);
  }
  return r.json();
}

/**
 * Commitea varios archivos de texto en un solo commit.
 * @param {{path:string, content:string}[]} archivos  rutas relativas al repo
 * @param {string} mensaje  mensaje del commit
 */
export async function commitArchivos(archivos, mensaje) {
  // 1. sha del commit actual de la rama y su árbol
  const ref = await gh("GET", `/git/ref/heads/${BRANCH}`);
  const commitActual = ref.object.sha;
  const { tree } = await gh("GET", `/git/commits/${commitActual}`);

  // 2. un blob por archivo
  const blobs = await Promise.all(
    archivos.map((a) =>
      gh("POST", "/git/blobs", { content: a.content, encoding: "utf-8" })
    )
  );

  // 3. árbol nuevo encima del actual
  const arbol = await gh("POST", "/git/trees", {
    base_tree: tree.sha,
    tree: archivos.map((a, i) => ({
      path: a.path,
      mode: "100644",
      type: "blob",
      sha: blobs[i].sha,
    })),
  });

  // 4. commit que apunta al árbol nuevo
  const commit = await gh("POST", "/git/commits", {
    message: mensaje,
    tree: arbol.sha,
    parents: [commitActual],
  });

  // 5. mover la rama al commit nuevo
  await gh("PATCH", `/git/refs/heads/${BRANCH}`, { sha: commit.sha });
  return commit.sha;
}
