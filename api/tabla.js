// /api/tabla.js
// Devuelve los resultados de la competición a la TV

import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Solo permitimos GET
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Ruta al archivo donde la app guarda los resultados
    const filePath = path.join(process.cwd(), "datos_competicion.json");

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: "Datos de competición no disponibles" });
    }

    // Leer el archivo y parsear JSON
    const contenido = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(contenido);

    // Validar estructura mínima
    if (!data.disciplina || !data.datos) {
      return res.status(500).json({ error: "Formato de datos incorrecto" });
    }

    // Devolver JSON directamente
    res.status(200).json(data);

  } catch (error) {
    console.error("Error en /api/tabla:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
