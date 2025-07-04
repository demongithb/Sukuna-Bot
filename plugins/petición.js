import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

const handler = async (m, { conn, text }) => {
  if (!text) throw '🇯🇵 Hanako: Oye... ¿y la URL? Usa: peticion <url> 😑'

  try {
    const res = await fetch(text)
    const contentType = res.headers.get('content-type') || ''

    if (!res.ok) {
      return m.reply(`❌ Error HTTP ${res.status}: ${res.statusText}`)
    }

    if (contentType.startsWith('image/')) {
      const buffer = await res.buffer()
      const generado = await sticker(buffer, false, global.packsticker, global.packsticker2)
      if (generado) {
        return conn.sendFile(m.chat, generado, 'sticker.webp', '', m)
      } else {
        return m.reply('🇯🇵 Hanako: Oye... no pude convertir esa imagen en sticker ;c')
      }
    }

    if (contentType.includes('application/json')) {
      const json = await res.json()
      const pretty = JSON.stringify(json, null, 2)
      return m.reply(`📦 JSON recibido:\n\`\`\`json\n${pretty}\n\`\`\``)
    }

    if (contentType.startsWith('text/')) {
      const textData = await res.text()
      return m.reply(`📄 Texto recibido:\n${textData.slice(0, 4000)}`) // por si es muy largo
    }

    // Si no es imagen, ni JSON, ni texto
    return m.reply(`📦 Archivo recibido con tipo: ${contentType}\nNo se puede mostrar directamente.`)

  } catch (err) {
    console.error(err)
    return m.reply(`❗ Error al hacer la petición:\n${err}`)
  }
}

handler.help = ['peticion <url>']
handler.tags = ['herramientas']
handler.command = ['peticion']

export default handler
