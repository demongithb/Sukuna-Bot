import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) return m.reply(`
╭─「 ✧ 𝑴𝒂𝒚𝑴𝒂𝒑𝒔 ✧ 」  
│ ✿ 𝑼𝒔𝒐: *${usedPrefix + command} <país | ciudad | lugar>*  
│ ✿ 𝐄𝐣: *${usedPrefix + command} Perú | Lima | Pachacútec*  
╰─────────────⭑`)

  try {
    const location = text.replace(/\|/g, ',').trim()
    const zoom = 15
    const size = '600x400'
    const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(location)}&zoom=${zoom}&size=${size}`

    let msg = `
╭─━━━✧『 𝑯𝒂𝒏𝒂𝒌𝒐 𝑴𝒂𝒑𝒔 』✧━━━─╮

🌍 *Ubicación:* ${location}
🌸 *Vista estática sacada desde los pasillos del Inodoro Fantasmal*

📍 Si no sale bien, prueba con más zoom o detalle al nombre!

╰─━━━✧⭑⭑⭑⭑━━━─╯`

    conn.sendFile(m.chat, mapUrl, 'mapa.jpg', msg, m)

  } catch (e) {
    console.error(e)
    m.reply(`⚠️ Error del mapa fantasma… intenta con otro sitio ⊂(・▽・)⊃`)
  }
}

handler.help = ['maymaps <país | ciudad | lugar>']
handler.tags = ['maps','tools']
handler.command = /^maymaps$/i

export default handler
