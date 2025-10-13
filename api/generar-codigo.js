// Este código se ejecuta en el servidor de Vercel, NUNCA en el navegador

export default async function handler(req, res) {
  // Solo aceptamos POST para evitar accesos indebidos
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Solo POST." });
  }

  // Leer variables de entorno seguras
  const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
  const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

  // Comprobación de seguridad
  if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
    return res.status(500).json({ error: "Variables de entorno no configuradas." });
  }

  // Generar un nuevo código aleatorio de 4 dígitos
  const nuevoCodigo = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // Actualizar el código en jsonbin.io de forma segura desde el servidor
    const response = await fetch(`https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY
      },
      body: JSON.stringify({ codigo_acceso: nuevoCodigo })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({
        error: `Error desde jsonbin.io: ${response.statusText}`,
        details: errorBody
      });
    }

    // Devolver el nuevo código al frontend
    return res.status(200).json({ nuevoCodigo });

  } catch (err) {
    return res.status(500).json({ error: `Error interno del servidor: ${err.message}` });
  }
}
