// /api/codigo.js
// Endpoint seguro que devuelve el código de acceso actual en JSON
// Para la TV

import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Solo permitimos GET
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    // Obtenemos la ruta al archivo local donde guardamos el código
    const filePath = path.join(process.cwd(), "codigo_actual.json");

    // Si el archivo no existe, devolvemos un error
    if (!fs.existsSync(filePath)) {
      res.status(500).json({ error: "Código no disponible" });
      return;
    }

    // Leemos el contenido del archivo
    const contenido = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(contenido);

    if (!data.codigo_acceso) {
      res.status(500).json({ error: "Código no configurado correctamente" });
      return;
    }

    // Devolvemos el código de acceso en formato JSON
    res.status(200).json({ codigo_acceso: data.codigo_acceso });

  } catch (error) {
    console.error("Error en /api/codigo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
