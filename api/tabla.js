// /api/tabla.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    // Ruta al archivo de resultados
    const filePath = path.join(process.cwd(), "api", "datos_competicion.json");

    // Comprobamos que exista el archivo
    if (!fs.existsSync(filePath)) {
      res.status(500).json({ error: "Archivo de resultados no encontrado" });
      return;
    }

    // Leemos el archivo y parseamos JSON
    const contenido = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(contenido);

    // Validamos que tenga la estructura mínima
    if (!data.disciplina || !data.datos) {
      res.status(500).json({ error: "Formato de datos incorrecto" });
      return;
    }

    // Enviamos los datos al frontend
    res.status(200).json(data);

  } catch (error) {
    console.error("Error en /api/tabla:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

