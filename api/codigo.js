// /api/codigo.js
// Devuelve el código de acceso actual desde JSONBin

const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
      return res.status(500).json({ error: "Variables de entorno no configuradas" });
    }

    const url = `https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}/latest`;
    const resp = await fetch(url, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Force-Update": "true"
      }
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ error: `Error al leer JSONBin: ${text}` });
    }

    const body = await resp.json();
    const record = body.record;
    if (!record || !record.codigo_acceso) {
      return res.status(500).json({ error: "Código no disponible en JSONBin" });
    }

    res.status(200).json({ codigo_acceso: record.codigo_acceso });
  } catch (err) {
    console.error("Error en /api/codigo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
