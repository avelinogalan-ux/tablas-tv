// /api/tabla.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    // Ruta al archivo de datos
    const filePath = path.join(process.cwd(), "datos_competicion.json");

    if (!fs.existsSync(filePath)) {
      res.status(500).json({ error: "Datos de competición no disponibles" });
      return;
    }

    const contenido = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(contenido);

    if (!data || !data.datos) {
      res.status(500).json({ error: "Formato de datos incorrecto" });
      return;
    }

    // Devolver los datos
    res.status(200).json(data);

  } catch (error) {
    console.error("Error en /api/tabla:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
