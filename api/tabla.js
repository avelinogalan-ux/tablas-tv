// /api/tabla.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const filePath = path.join(process.cwd(), "api", "datos_competicion.json");

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: "Archivo de datos no encontrado" });
    }

    const contenido = fs.readFileSync(filePath, "utf-8");
    const datos = JSON.parse(contenido);

    res.status(200).json(datos);

  } catch (error) {
    console.error("Error en /api/tabla:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
