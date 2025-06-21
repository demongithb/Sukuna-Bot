import yts from "yt-search";
import { ytv, yta } from "@soymaycol/maytube";

const limit = 100; // MB

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("> Ingresa el nombre de un video o una URL de YouTube.");

  await m.react("🕛");
  console.log("🔍 Buscando en YouTube...");

  try {
    const res = await yts(text);
    if (!res?.all?.length) return m.reply("❌ No se encontraron resultados para tu búsqueda.");

    const video = res.all[0];
    if (!video?.url) return m.reply("❌ No se pudo obtener el enlace del video.");

    const {
      title = "Sin título",
      author = { name: "Desconocido" },
      views = "Desconocidas",
      duration = {},
      thumbnail = "",
      url
    } = video;

    const processingMessage = `*「❀」${title}*
> *✧ Canal:* ${author.name}
> *✧ Duración:* ${duration.timestamp || "Desconocida"}
> *✧ Vistas:* ${views}

⏳ *Descargando...* Espera un momento.`;

    let sentMessage;
    try {
      sentMessage = await conn.sendFile(m.chat, thumbnail, "thumb.jpg", processingMessage, m);
    } catch (e) {
      console.log("⚠️ Miniatura fallida:", e.message);
      sentMessage = await m.reply(processingMessage);
    }

    if (["play", "playaudio", "ytmp3"].includes(command)) {
      await downloadAudio(conn, m, video, title);
    } else if (["play2", "playvid", "ytv", "ytmp4"].includes(command)) {
      await downloadVideo(conn, m, video, title);
    }

  } catch (err) {
    console.error("❌ Error general:", err);
    await m.reply(`❌ Error al procesar:\n${err.message}`);
    await m.react("❌");
  }
};

const downloadAudio = async (conn, m, video, title) => {
  try {
    console.log("🎧 Intentando con MayTube...");
    let api = await yta(video.url);

    if (!api?.status || !api.result?.download) {
      console.warn("❌ MayTube falló, usando Sylphy...");
      const res = await fetch(`https://api.sylphy.xyz/download/ytmp3?apikey=sylphy-5886&url=${encodeURIComponent(video.url)}`);
      const data = await res.json();
      if (!data?.url) throw new Error("Sylphy tampoco devolvió un enlace válido");
      api = {
        result: {
          title: data.title || title,
          download: data.url
        }
      };
    }

    await conn.sendFile(
      m.chat,
      api.result.download,
      `${(api.result.title || title).replace(/[^\w\s]/gi, '')}.mp3`,
      `🎵 *${api.result.title || title}*`,
      m
    );
    await m.react("✅");
    console.log("✅ Audio enviado");

  } catch (error) {
    console.error("❌ Error audio:", error);
    await m.reply(`❌ Error al descargar el audio:\n${error.message}`);
    await m.react("❌");
  }
};

const downloadVideo = async (conn, m, video, title) => {
  try {
    console.log("📹 Intentando con MayTube...");
    let api = await ytv(video.url);

    if (!api?.url) {
      console.warn("❌ MayTube falló, usando Sylphy...");
      const res = await fetch(`https://api.sylphy.xyz/download/ytmp4?apikey=sylphy-5886&url=${encodeURIComponent(video.url)}`);
      const data = await res.json();
      if (!data?.url) throw new Error("Sylphy tampoco devolvió un enlace válido");
      api = {
        title: data.title || title,
        url: data.url
      };
    }

    let sizemb = 0;
    try {
      const head = await fetch(api.url, { method: 'HEAD' });
      const length = head.headers.get('content-length');
      if (length) sizemb = parseInt(length) / (1024 * 1024);
    } catch (e) {
      console.log("⚠️ No se pudo verificar tamaño:", e.message);
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`🚫 Archivo muy pesado (${sizemb.toFixed(2)} MB). Límite: ${limit} MB`);
    }

    await conn.sendFile(
      m.chat,
      api.url,
      `${(api.title || title).replace(/[^\w\s]/gi, '')}.mp4`,
      `📹 *${api.title || title}*`,
      m,
      null,
      {
        asDocument: sizemb >= limit,
        mimetype: "video/mp4"
      }
    );
    await m.react("✅");
    console.log("✅ Video enviado");

  } catch (error) {
    console.error("❌ Error video:", error);
    await m.reply(`❌ Error al descargar el video:\n${error.message}`);
    await m.react("❌");
  }
};

handler.command = handler.help = ['play', 'playaudio', 'ytmp3', 'play2', 'playvid', 'ytv', 'ytmp4'];
handler.tags = ['descargas'];

export default handler;
