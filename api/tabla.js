// /api/tabla.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Solo permitimos GET
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    // Ruta al archivo JSON con los datos de la competición
    const filePath = path.join(process.cwd(), "datos_competicion.json");

    if (!fs.existsSync(filePath)) {
      res.status(500).json({ error: "Datos de competición no disponibles" });
      return;
    }

    // Leemos y parseamos el archivo JSON
    const contenido = fs.readFileSync(filePath, "utf-8");
    const datos = JSON.parse(contenido);

    // Verificamos que tenga la estructura correcta
    if (!datos.disciplina || !datos.datos) {
      res.status(500).json({ error: "Formato de datos incorrecto" });
      return;
    }

    // Devolvemos los datos de competición actuales
    res.status(200).json(datos);

  } catch (error) {
    console.error("Error en /api/tabla:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

