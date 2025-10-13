// /api/codigo.js
export default function handler(req, res) {
  // Solo permitimos GET
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    // Aquí pondrías el código generado dinámicamente o de tu JSON en Vercel
    const codigo_acceso = process.env.CODIGO_ACCESO || "1234"; 

    res.status(200).json({ codigo_acceso });
  } catch (error) {
    console.error("Error en /api/codigo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
