// Usando Adonix API para stats y NightAPI para descargar xD
// GitHub: SoySapo6
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌸 Ingresa el enlace de un video de TikTok.\n\n📌 *Ejemplo:*\n${usedPrefix + command} https://vm.tiktok.com/xxxxxx`);

  try {
    await m.react('🎴');

    const adonixApi = `https://theadonix-api.vercel.app/api/tiktok?url=${encodeURIComponent(text)}`;
    const statsRes = await fetch(adonixApi);
    const statsData = await statsRes.json();

    if (!statsData?.result?.video) {
      await m.react('❌');
      return m.reply('❌ No se pudo obtener los detalles del video.');
    }

    const { title, author, thumbnail, duration, likes, comments, shares, views } = statsData.result;

    const caption = `「✦」Descargando *${title}*
ღ *Autor :* ${author.name} (@${author.username})
❐ *Duración :* ${duration} segundos
★ *Likes :* ${likes}
✿ *Comentarios :* ${comments}
🜲 *Compartidos :* ${shares}
⌨︎︎ *Vistas :* ${views}
☁︎ *Servidor :* NightAPI & Adonix`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    const nightApi = `https://nightapi.is-a.dev/api/tiktok?url=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, {
      video: { url: nightApi },
      mimetype: 'video/mp4',
      fileName: `${author.username || 'video'}.mp4`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('⚠️');
    m.reply(`❌ Error al procesar el enlace.`);
  }
};

handler.help = ['tiktok'].map((v) => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
handler.group = true;
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;