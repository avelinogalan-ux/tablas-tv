import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const filePath = path.join(process.cwd(), "datos_competicion.json");

    if (!fs.existsSync(filePath)) {
      // Si el archivo no existe, devolver datos de ejemplo
      console.warn("Archivo datos_competicion.json no encontrado, usando datos de ejemplo");
      const datosEjemplo = {
        disciplina: "Competición de Prueba",
        datos: [
          {
            puesto: 1,
            nombre: "Competidor Ejemplo",
            series: [10, 9, 10, 10, 9],
            total: 48,
            xTotal: 3
          }
        ]
      };
      return res.status(200).json(datosEjemplo);
    }

    const contenido = fs.readFileSync(filePath, "utf-8");
    const datos = JSON.parse(contenido);

    if (!datos.disciplina || !datos.datos) {
      return res.status(500).json({ error: "Formato de datos incorrecto" });
    }

    res.status(200).json(datos);

  } catch (error) {
    console.error("Error en /api/tabla:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
