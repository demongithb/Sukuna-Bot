import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {

    if (!args[0] || !args.join(' ').includes('|')) {
        return m.reply('⚠️ Usa el formato correcto:\n*darkletras Artista | Canción*\n\nEjemplo:\ndarkletras Coldplay | Yellow')
    }

    let [artista, cancion] = args.join(' ').split('|').map(v => v.trim())
  
    if (!artista || !cancion) {
        return m.reply('⚠️ Faltan datos, recuerda:\n*darkletras Artista | Canción*')
    }

    let res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(cancion)}`)
  
    if (!res.ok) return m.reply('🚫 No encontré la letra, revisa los datos UwU')
  
    let json = await res.json()
  
    if (!json.lyrics) return m.reply('🚫 No encontré la letra, revisa los datos UwU')
  
    let letras = json.lyrics.split('\n').filter(v => v.trim())
  
    if (!letras.length) return m.reply('🚫 No hay líneas de letra para mostrar UwU')
  
    m.reply(`🎤 *${artista} - ${cancion}*\nLetras llegando en 3... 2... 1... (⁠｡⁠･⁠ω⁠･⁠｡⁠)⁠ﾉ⁠♡`)

    for (let linea of letras) {
        await new Promise(r => setTimeout(r, 1000)) // Espera de 1 segundo
        await conn.sendMessage(m.chat, { text: linea }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { text: `✅ *Letra completa de:* ${artista} - ${cancion}\n(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤` }, { quoted: m })
}

handler.help = ['darkletras artista | canción']
handler.tags = ['tools']
handler.command = ['darkletras']

export default handler
