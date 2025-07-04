import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, '⚠️ Te faltó el texto para usar *SimiChat*.', m);
  }

  try {
    const res = await axios.get(`https://nightapioficial.onrender.com/api/simi?text=${encodeURIComponent(text)}&language=es`);
    const respuesta = res.data.response || '❌ No se pudo obtener respuesta.';

    await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, '❌ Ocurrió un error al conectar con la API.', m);
  }
};

handler.help = ['simi'];
handler.tags = ['ai'];
handler.command = ['simi'];
handler.group = false;
handler.register = true;

export default handler;
