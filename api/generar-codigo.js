// Este código se ejecuta en el servidor de Vercel, nunca en el frontend
export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Solo POST." });
  }

  const { codigo } = req.body;

  // Leer variables de entorno seguras
  const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
  const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

  if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
    return res.status(500).json({ error: "Variables de entorno no configuradas." });
  }

  try {
    // Consultamos jsonbin desde el servidor
    const response = await fetch(`https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      return res.status(response.status).json({ error: "Error Jsonbin", details: body });
    }

    const data = await response.json();
    const codigoCorrecto = data.record.codigo_acceso;

    // Comprobamos el código
    const valido = codigo === codigoCorrecto;

    return res.status(200).json({ valido });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
