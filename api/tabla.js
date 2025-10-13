// /api/tabla.js
import fetch from "node-fetch";

// Configura estas variables de entorno en Vercel
const DATOS_COMPETICION_BIN_ID = process.env.DATOS_COMPETICION_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  try {
    // Solo permitimos GET
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    if (!DATOS_COMPETICION_BIN_ID || !JSONBIN_API_KEY) {
      res.status(500).json({ error: "Variables de entorno no configuradas" });
      return;
    }

    const url = `https://api.jsonbin.io/v3/b/${DATOS_COMPETICION_BIN_ID}/latest`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Force-Update": "true",
      },
    });

    // Manejo de errores comunes
    if (response.status === 401) {
      res.status(401).json({ error: "No autorizado: API Key inválida" });
      return;
    }

    if (response.status === 404) {
      res.status(404).json({ error: "Bin no encontrado" });
      return;
    }

    if (!response.ok) {
      res
        .status(response.status)
        .json({ error: `Error al obtener datos: ${response.statusText}` });
      return;
    }

    // Obtener JSON y devolverlo
    const data = await response.json();
    res.status(200).json(data.record);

  } catch (error) {
    console.error("Error en /api/tabla:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
