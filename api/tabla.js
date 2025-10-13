import fetch from "node-fetch";

const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
const DATOS_COMPETICION_BIN_ID = process.env.DATOS_COMPETICION_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({ error: "Falta el código de acceso" });
    }

    // 1️⃣ Obtener el código actual de JSONBIN
    const codigoResponse = await fetch(`https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Force-Update": "true"
      }
    });

    if (!codigoResponse.ok) {
      return res.status(500).json({ error: "No se pudo verificar el código de acceso" });
    }

    const codigoData = await codigoResponse.json();
    const codigoActual = codigoData.record.codigo_acceso;

    // 2️⃣ Validar el código
    if (codigo !== codigoActual) {
      return res.status(401).json({ error: "Código de acceso incorrecto" });
    }

    // 3️⃣ Obtener los datos de la competición
    const datosResponse = await fetch(`https://api.jsonbin.io/v3/b/${DATOS_COMPETICION_BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Force-Update": "true"
      }
    });

    if (!datosResponse.ok) {
      return res.status(500).json({ error: "No se pudieron obtener los datos de la competición" });
    }

    const datosData = await datosResponse.json();

    // 4️⃣ Enviar la respuesta al cliente
    return res.status(200).json({ accesoValido: true, datos: datosData.record });

  } catch (error) {
    console.error(error);
