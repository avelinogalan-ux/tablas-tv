import fetch from "node-fetch";

const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
const DATOS_COMPETICION_BIN_ID = process.env.DATOS_COMPETICION_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { codigo } = req.body;

  if (!codigo || codigo.length !== 4) {
    return res.status(400).json({ error: "Código inválido" });
  }

  try {
    // 1️⃣ Obtenemos el código correcto desde JSONBIN
    const responseCodigo = await fetch(`https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Force-Update": "true",
      },
    });

    if (!responseCodigo.ok) {
      return res.status(500).json({ error: "No se pudo verificar el código" });
    }

    const dataCodigo = await responseCodigo.json();
    const codigoCorrecto = dataCodigo.record.codigo_acceso;

    if (codigo !== codigoCorrecto) {
      return res.status(401).json({ error: "Código de acceso incorrecto" });
    }

    // 2️⃣ Obtenemos los datos de la competición
    const responseDatos = await fetch(`https://api.jsonbin.io/v3/b/${DATOS_COMPETICION_BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Force-Update": "true",
      },
    });

    if (!responseDatos.ok) {
      return res.status(500).json({ error: "No se pudieron obtener los datos" });
    }

    const datos = await responseDatos.json();

    // 3️⃣ Devolvemos los datos a la TV
    return res.status(200).json({ accesoValido: true, ...datos.record });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
