// Este código se ejecuta en el servidor de Vercel, no en el navegador.

export default async function handler(request, response) {
  // 1. Leer las claves secretas de forma segura desde las variables de entorno del servidor.
  //    Usamos process.env, que es la forma estándar en Node.js (el entorno de Vercel).
  const CODIGO_ACCESO_BIN_ID = process.env.VITE_CODIGO_ACCESO_BIN_ID;
  const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY; // Nota: sin el prefijo VITE_

  // 2. Comprobación de seguridad: Asegurarse de que las variables están configuradas.
  if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
    return response.status(500).json({ error: 'Variables de entorno no configuradas en el servidor.' });
  }

  // 3. Comprobación de seguridad: Solo permitir peticiones de tipo POST para evitar accesos indebidos.
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido. Solo se aceptan peticiones POST.' });
  }

  // 4. Generar el nuevo código aleatorio.
  const nuevoCodigo = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // 5. Contactar con jsonbin.io de forma segura desde el servidor.
    const apiResponse = await fetch(`https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
      },
      body: JSON.stringify({ "codigo_acceso": nuevoCodigo }),
    });

    // Si jsonbin.io da un error, lo notificamos.
    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      return response.status(apiResponse.status).json({
        error: `Error desde jsonbin.io: ${apiResponse.statusText}`,
        details: errorBody
      });
    }

    // 6. Si todo fue bien, devolvemos el nuevo código al frontend.
    return response.status(200).json({ nuevoCodigo: nuevoCodigo });

  } catch (error) {
    // Si hay un error de red o de otro tipo, lo capturamos.
    return response.status(500).json({ error: `Error interno del servidor: ${error.message}` });
  }
}
