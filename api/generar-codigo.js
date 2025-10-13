// /api/generar-codigo.js

// Variables de entorno configuradas en Vercel
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

    // Generar un código aleatorio de 4 dígitos
    const nuevoCodigo = Math.floor(1000 + Math.random() * 9000).toString();

    // Guardar en JSONBin
    const url = `https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Bin-Private": "false"
      },
      body: JSON.stringify({ codigo_acceso: nuevoCodigo })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: `Error al actualizar JSONBin: ${text}` });
    }

    return res.status(200).json({ nuevoCodigo });

  } catch (error) {
    console.error("Error en /api/generar-codigo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
