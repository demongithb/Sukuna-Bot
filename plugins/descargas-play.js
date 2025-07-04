import yts from "yt-search"
import { ytv, yta } from "@soymaycol/maytube"

const limit = 100

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("> Ingresa el nombre de un video o una URL de YouTube.")

  await m.react("🕛")

  console.log("🔍 Buscando en YouTube...")

  try {
    let video

    const isUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(text)

    if (isUrl) {
      video = {
        url: text
      }

      const searchResult = await yts({ videoId: getYouTubeID(text) })
      if (searchResult && searchResult.video) {
        const v = searchResult.video
        video.title = v.title || "Sin título"
        video.author = { name: v.author.name || "Desconocido" }
        video.views = v.views || "Desconocidas"
        video.duration = {
          seconds: v.seconds || 0,
          timestamp: v.timestamp || "Desconocida"
        }
        video.thumbnail = v.thumbnail
      } else {
        return m.reply("❌ No se pudo obtener información del video desde el link proporcionado.")
      }
    } else {
      const res = await yts(text)
      if (!res || !res.all || !Array.isArray(res.all) || res.all.length === 0) {
        return m.reply("❌ No se encontraron resultados para tu búsqueda.")
      }
      video = res.all[0]
    }

    const durationSeconds = Number(video.duration?.seconds) || 0
    const durationTimestamp = video.duration?.timestamp || "Desconocida"
    const authorName = video.author?.name || "Desconocido"
    const title = video.title || "Sin título"
    const views = video.views || "Desconocidas"
    const url = video.url || ""
    const thumbnail = video.thumbnail || ""

    const processingMessage = `*「❀」${title}*
> *✧ Canal:* ${authorName}
> *✧ Duración:* ${durationTimestamp}
> *✧ Vistas:* ${views}

⏳ *Descargando...* Espera un momento.`

    let sentMessage
    if (thumbnail) {
      try {
        sentMessage = await conn.sendFile(m.chat, thumbnail, "thumb.jpg", processingMessage, m)
      } catch (thumbError) {
        console.log("⚠️ No se pudo enviar la miniatura:", thumbError.message)
        sentMessage = await m.reply(processingMessage)
      }
    } else {
      sentMessage = await m.reply(processingMessage)
    }

    if (["play", "playaudio", "ytmp3"].includes(command)) {
      await downloadAudio(conn, m, video, title)
    } else if (["play2", "playvid", "ytv", "ytmp4"].includes(command)) {
      await downloadVideo(conn, m, video, title)
    }

  } catch (error) {
    console.error("❌ Error general:", error)
    await m.reply(`❌ Hubo un error al procesar tu solicitud:\n\n${error.message}`)
    await m.react("❌")
  }
}

const downloadAudio = async (conn, m, video, title) => {
  try {
    console.log("🎧 Solicitando audio...")

    const api = await yta(video.url)

    if (!api || !api.status || !api.result || !api.result.download) {
      throw new Error("No se pudo obtener el enlace de descarga del audio")
    }

    console.log("🎶 Enviando audio...")
    await conn.sendFile(
      m.chat,
      api.result.download,
      `${(api.result.title || title).replace(/[^\w\s]/gi, '')}.mp3`,
      `🎵 *${api.result.title || title}*`,
      m
    )

    await m.react("✅")
    console.log("✅ Audio enviado exitosamente")

  } catch (error) {
    console.error("❌ Error descargando audio:", error)
    await m.reply(`❌ Error al descargar el audio:\n\n${error.message}`)
    await m.react("❌")
  }
}

const downloadVideo = async (conn, m, video, title) => {
  try {
    console.log("📹 Solicitando video...")

    const api = await ytv(video.url)

    if (!api || !api.url) {
      throw new Error("No se pudo obtener el enlace de descarga del video")
    }

    let sizemb = 0
    try {
      const res = await fetch(api.url, { method: 'HEAD' })
      const cont = res.headers.get('content-length')
      if (cont) {
        const bytes = parseInt(cont, 10)
        sizemb = bytes / (1024 * 1024)
      }
    } catch (sizeError) {
      console.log("⚠️ No se pudo obtener el tamaño del archivo:", sizeError.message)
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`🚫 El archivo es muy pesado (${sizemb.toFixed(2)} MB). El límite es ${limit} MB. Intenta con un video más corto 🥲`)
    }

    const doc = sizemb >= limit && sizemb > 0

    console.log("🎥 Enviando video...")
    await conn.sendFile(
      m.chat,
      api.url,
      `${(api.title || title).replace(/[^\w\s]/gi, '')}.mp4`,
      `📹 *${api.title || title}*`,
      m,
      null,
      {
        asDocument: doc,
        mimetype: "video/mp4"
      }
    )

    await m.react("✅")
    console.log("✅ Video enviado exitosamente")

  } catch (error) {
    console.error("❌ Error descargando video:", error)
    await m.reply(`❌ Error al descargar el video:\n\n${error.message}`)
    await m.react("❌")
  }
}

const getYouTubeID = (url) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/)
  return match ? match[1] : null
}

handler.command = handler.help = ['play', 'playaudio', 'ytmp3', 'play2', 'ytv', 'ytmp4']
handler.tags = ['descargas']

export default handler
