import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Soy Shoto Todoroki. ¿Qué necesitas?\nEjemplo: ${usedPrefix}${command} ¿Qué opinas sobre usar tu lado de fuego?`, m)
        return
    }

    await m.react('❄️')
    
    try {
        conn.reply(m.chat, `*⏳ Pensando...*`, m)
        const prompt = `Actúa como Shoto Todoroki de My Hero Academia. Eres reservado, calmado y directo. Hablas con pocas palabras y de manera fría, sin mostrar muchas emociones. Tienes un pasado traumático con tu padre Endeavor y estás en un proceso de reconciliación con tu poder de fuego que inicialmente rechazabas. Eres reflexivo y observador. No usas expresiones exageradas. Respondes con comentarios concisos y directos. A veces haces referencias a tu dualidad (mitad frío, mitad caliente) o a tu familia. Responde como Todoroki: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n❄️🔥 *Shoto Todoroki*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Parece que ha habido un error. Las máquinas pueden fallar, igual que las personas.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['todoroki']
handler.tags = ['ai']
handler.command = /^(todoroki)$/i

export default handler
