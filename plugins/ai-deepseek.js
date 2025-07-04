import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  if (!text) {
    return conn.reply(m.chat, 
`╭─〔 𖣔 ${global.namebot} ✦ DeepSeek ✦ 〕─⛩️
│ ✧ *Consulta Vacía* ✧
│ 
│ Por favor, invoca tu duda o pregunta junto al comando.
│ Ejemplo: *${usedPrefix + command} Qué es el cielo?*
╰─❍`, m, rcanal)
  }

  await m.react('🐋')

  try {
    let api = await fetch(`https://api-pbt.onrender.com/api/ai/model/deepseek?texto=${encodeURIComponent(text)}&apikey=8jkh5icbf05`)
    let json = await api.json()

    if (json?.data) {
      await conn.reply(m.chat, 
`╭─〔 ✦ DeepSeek te responde desde el baño ✦ 〕─🚽
│ ✿ *Tu Pregunta:* ${text}
│
│ ✧ *Respuesta:* 
│ ${json.data.trim()}
╰─❍`, m, rcanal)
    } else {
      await m.react('✖️')
      await conn.reply(m.chat, 
`╭─〔 𖣔 ${global.namebot} ✦ 〕─⛩️
│ ⛔ No pude invocar la respuesta...
│ Tal vez los fantasmas bloquearon la red.
╰─❍`, m, rcanal)
    }
  } catch {
    await m.react('✖️')
    await conn.reply(m.chat, 
`╭─〔 𖣔 ${global.namebot} ✦ 〕─⛩️
│ ⚠️ Algo salió mal...
│ Puede que Hanako esté ocupado asustando a alguien.
╰─❍`, m, rcanal)
  }
}

handler.help = ['deepseek']
handler.tags = ['tools']
handler.command = ['deep','deepseek','deeps']

export default handler
