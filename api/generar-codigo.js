// /api/generar-codigo.js
// Genera un código de 4 dígitos y lo guarda en JSONBin

const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
      return res.status(500).json({ error: "Variables de entorno no configuradas" });
    }

    const nuevoCodigo = Math.floor(1000 + Math.random() * 9000).toString();
    const payload = { codigo_acceso: nuevoCodigo, timestamp: Date.now() };

    const url = `https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Bin-Private": "false"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: `Error al actualizar JSONBin: ${text}` });
    }

    res.status(200).json({ nuevoCodigo });
  } catch (err) {
    console.error("Error en /api/generar-codigo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
