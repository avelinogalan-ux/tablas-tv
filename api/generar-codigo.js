// /api/generar-codigo.js
import fetch from "node-fetch";

// Variables de entorno que debes configurar en Vercel
const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  try {
    // Solo permitimos POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
      res.status(500).json({ error: "Variables de entorno no configuradas" });
      return;
    }

    // Generar un código aleatorio de 4 dígitos
    const nuevoCodigo = String(Math.floor(1000 + Math.random() * 9000));

    // URL del bin de JSONBin
    const url = `https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`;

    // Actualizar el bin con el nuevo código
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Bin-Versioning": "false", // Sobrescribir el contenido
      },
      body: JSON.stringify({ codigo_acceso: nuevoCodigo }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).json({ error: `Error al actualizar JSONBin: ${errorText}` });
      return;
    }

    // Responder con el nuevo código
    res.status(200).json({ nuevoCodigo });

  } catch (error) {
    console.error("Error en /api/generar-codigo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
