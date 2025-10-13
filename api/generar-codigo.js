// /api/generar-codigo.js
import fetch from 'node-fetch';

// Variables de entorno que debes configurar en Vercel
const CODIGO_ACCESO_BIN_ID = process.env.CODIGO_ACCESO_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        if (!CODIGO_ACCESO_BIN_ID || !JSONBIN_API_KEY) {
            res.status(500).json({ error: 'Variables de entorno no configuradas' });
            return;
        }

        // Generar código de 4 dígitos aleatorio
        const nuevoCodigo = Math.floor(1000 + Math.random() * 9000).toString();

        // Preparar payload para JSONBin
        const payload = {
            codigo_acceso: nuevoCodigo
        };

        // Actualizar JSONBin con el nuevo código
        const url = `https://api.jsonbin.io/v3/b/${CODIGO_ACCESO_BIN_ID}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY,
                'X-Bin-Versioning': 'false'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error al actualizar JSONBin: ${response.status} ${text}`);
        }

        res.status(200).json({ nuevoCodigo });
    } catch (error) {
        console.error('Error en /api/generar-codigo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
