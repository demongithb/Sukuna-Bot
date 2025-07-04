import fetch from 'node-fetch'

const handler = async (msg, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ')
  const chatId = msg.key.remoteJid

  if (!text) {
    return conn.sendMessage(chatId, {
      text: `✳️ Ingresa tu pregunta\nEjemplo: *${usedPrefix + command}* ¿quién inventó WhatsApp?`
    }, { quoted: msg })
  }

  try {
    await conn.sendMessage(chatId, { react: { text: '💭', key: msg.key } })

    const res = await fetch(`https://nightapi.is-a.dev/api/xex?message=${encodeURIComponent(text)}`)
    const data = await res.json()

    if (!data.status) throw new Error('No se obtuvo respuesta de la IA')

    const respuesta = `${data.result}\n\n> Hecho por ${data.creator}`

    await conn.sendMessage(chatId, { text: respuesta }, { quoted: msg })
    await conn.sendMessage(chatId, { react: { text: '✅', key: msg.key } })

  } catch (error) {
    console.error(error)
    await conn.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: msg })
    await conn.sendMessage(chatId, { react: { text: '❌', key: msg.key } })
  }
}

handler.help = ['xex <pregunta>']
handler.command = ['xex', 'ai', 'ask']
handler.tags = ['ai']
handler.register = true

export default handler
