import axios from 'axios'
import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import path from 'path'

let handler = async (m, { args, text, conn }) => {
  if (!text) return m.reply(`🚫 ¡Escribe una palabra clave!\n\nEjemplo:\n.ascii naruto`)

  try {
    const res = await axios.get('https://emojicombos.com/anime-text-art', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    const $ = cheerio.load(res.data)
    const resultados = []

    $('.combo-ctn').each((_, el) => {
      const etiquetas = $(el).find('.keywords a').map((i, tag) => $(tag).text().toLowerCase()).get()
      const coincide = etiquetas.some(tag => tag.includes(text.toLowerCase()))
      if (coincide) {
        const arte = $(el).find('.emojis').text().trim()
        if (arte.length > 10) resultados.push(arte)
      }
    })

    if (resultados.length === 0)
      return m.reply(`❌ No se encontró ASCII Art relacionado con: *${text}*`)

    const limitado = resultados.slice(0, 10)
    const contenido = `🎭 Resultado de ASCII Art para: ${text}\n\n` +
      limitado.join('\n\n' + '-'.repeat(40) + '\n\n')

    const ruta = path.resolve('./tmp', `ascii-${Date.now()}.txt`)
    writeFileSync(ruta, contenido)

    await conn.sendMessage(m.chat, {
      document: { url: ruta },
      fileName: `ascii-${text}.txt`,
      mimetype: 'text/plain',
      caption: `📂 Se encontraron *${limitado.length}* ASCII Art para: *${text}*`
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ Ocurrió un error al obtener los datos.')
  }
}

handler.help = ['ascii <nombre>']
handler.tags = ['tools']
handler.command = /^ascii$/i

export default handler
