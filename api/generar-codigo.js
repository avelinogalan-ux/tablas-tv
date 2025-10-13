// /api/generar-codigo.js
import fetch from "node-fetch";

// Variables de entorno de Vercel
const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
    return res.status(500).json({ error: "Variables de entorno no configuradas" });
  }

  try {
    // 1. Generar un nuevo código aleatorio de 4 dígitos
    const nuevoCodigo = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Actualizar el bin en JSONBin
    const url = `https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "Content-Type": "application/json",
        "X-Bin-Versioning": "false", // sobrescribir el bin
      },
      body: JSON.stringify({ codigo_acceso: nuevoCodigo }),
    });

    // Leer la respuesta como texto por si no es JSON
    const responseText = await response.text();

    if (!response.ok) {
      // Intentamos parsear JSON si es posible
      try {
        const errorJson = JSON.parse(responseText);
        return res.status(response.status).json({ error: errorJson.message || JSON.stringify(errorJson) });
      } catch {
        return res.status(response.status).json({ error: `JSONBin returned invalid JSON: ${responseText}` });
      }
    }

    // Parsear JSON exitosamente
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (err) {
      console.error("Error parsing JSONBin response:", responseText);
      return res.status(500).json({ error: `JSONBin returned invalid JSON: ${responseText}` });
    }

    // Todo correcto: devolver nuevo código
    return res.status(200).json({ nuevoCodigo });

  } catch (err) {
    console.error("Error en /api/generar-codigo:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
