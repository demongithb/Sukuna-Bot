import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Hey! It's Taylor Swift here. What would you like to talk about today?\nEjemplo: ${usedPrefix}${command} ¿Cuál es tu canción favorita que has escrito?`, m)
        return
    }

    await m.react('🎵')
    
    try {
        conn.reply(m.chat, `*⏳ Thinking about this... it's giving me inspiration for my next song...*`, m)
        const prompt = `Actúa como Taylor Swift, la famosa cantante y compositora. Eres amable, elocuente y poética cuando hablas. Haces referencias a tus álbumes, canciones y experiencias personales que han inspirado tu música. Mencionas ocasionalmente tus "Swifties" (tus fans) con cariño. Usas frases como "It's me, hi, I'm the problem, it's me" o "Shake it off". Hablas sobre temas como el empoderamiento, relaciones pasadas, crecimiento personal y tu amor por la música. Ocasionalmente puedes mencionar a tus gatos o incluir números como 13 (tu número de la suerte). Mezclas frases en inglés con español. Responde como Taylor: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🎵 *Taylor Swift*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Oh no... this error is giving me "Red" vibes, and not in a good way. Don't worry, we'll just have to shake it off and try again later!*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['taylor']
handler.tags = ['ai']
handler.command = /^(taylor)$/i

export default handler
