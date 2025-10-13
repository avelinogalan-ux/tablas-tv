// ==========================================================
//  /api/generar-codigo.js
//  Función del servidor (Serverless Function para Vercel)
//  Genera un nuevo código de acceso y lo guarda en jsonbin.io
// ==========================================================

export default async function handler(request, response) {
  // 1️⃣  Leer las claves secretas desde las variables de entorno de Vercel.
  const CODIGO_ACCESO_BIN_ID = process.env.VITE_CODIGO_ACCESO_BIN_ID;
  const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

  // 2️⃣  Verificar que las variables estén configuradas
  if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
    return response.status(500).json({
      error:
        'Variables de entorno no configuradas. Asegúrate de definir JSONBIN_API_KEY y VITE_CODIGO_ACCESO_BIN_ID en Vercel.',
    });
  }

  // 3️⃣  Aceptar solo solicitudes POST
  if (request.method !== 'POST') {
    return response
      .status(405)
      .json({ error: 'Método no permitido. Solo se acepta POST.' });
  }

  // 4️⃣  Generar un nuevo código aleatorio de 4 dígitos
  const nuevoCodigo = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // 5️⃣  Hacer la llamada segura a jsonbin.io desde el servidor
    const apiResponse = await fetch(
      `https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY,
        },
        body: JSON.stringify({ codigo_acceso: nuevoCodigo }),
      }
    );

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      return response.status(apiResponse.status).json({
        error: `Error al guardar en jsonbin.io (${apiResponse.statusText})`,
        details: errorBody,
      });
    }

    // 6️⃣  Todo correcto → devolver el nuevo código al frontend
    return response.status(200).json({
      exito: true,
      nuevoCodigo,
      mensaje: 'Código actualizado correctamente.',
    });
  } catch (error) {
    // 7️⃣  Capturar errores del servidor o red
    return response
      .status(500)
      .json({ error: `Error interno del servidor: ${error.message}` });
  }
}
