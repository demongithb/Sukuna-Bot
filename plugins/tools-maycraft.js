import fetch from 'node-fetch'

let handler = async (m, { text, conn, usedPrefix, command }) => {
  
  if (!text) return m.reply(`╭─「 ✧ 𝑴𝒂𝒚𝑪𝒓𝒂𝒇𝒕 ✧ 」  
│ ✿ 𝑼𝒔𝒐: *${usedPrefix + command} <ip o dominio>*  
╰─────────────⭑`)

  try {
    let urlApi = `https://api.lolhuman.xyz/api/minecraft/${encodeURIComponent(text)}?apikey=6ce04afb2b5577b3aa412c88`
    let res = await fetch(urlApi)
    let json = await res.json()
    
    if (json.status !== 200) throw 'Servidor no encontrado o apagado 🥀'

    let version = json.result.version
    let online = json.result.players.online
    let max = json.result.players.max
    let latency = json.result.latency

    // Imagen aleatoria
    let urlImg = `https://delirius-apiofc.vercel.app/search/gimage?query=${encodeURIComponent(text)}`
    let resImg = await fetch(urlImg)
    let jsonImg = await resImg.json()

    let img = jsonImg?.data?.length ? jsonImg.data[Math.floor(Math.random() * jsonImg.data.length)].url : null

    let msg = `
╭─━━━✧⭑⭑⭑『 𝑯𝒂𝒏𝒂𝒌𝒐 𝑲𝒖𝒏 ~ 𝑴𝒂𝒚𝑪𝒓𝒂𝒇𝒕 』⭑⭑⭑✧━━━─╮

🌸 *Servidor:* ${text}
🌸 *Versión:* ${version}
🌸 *Jugadores:* ${online}/${max}
🌸 *Latencia:* ${latency} ms

> Hecho por SoyMaycol <3

╰─━━━✧⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑━━━─╯`

    if (img) {
      conn.sendFile(m.chat, img, 'server.jpg', msg, m)
    } else {
      m.reply(msg)
    }

  } catch (e) {
    console.error(e)
    m.reply(`⚠️ Error, asegúrate que el servidor existe y esté online ⊂(・▽・)⊃`)
  }
}

handler.help = ['maycraft <servidor>']
handler.tags = ['tools']
handler.command = ['maycraft']

export default handler
