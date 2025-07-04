import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `*Suspira* Soy Roronoa Zoro. ¿Estás perdido o necesitas ayuda con algo?\nEjemplo: ${usedPrefix}${command} ¿Cuál es tu objetivo como espadachín?`, m)
        return
    }

    await m.react('⚔️')
    
    try {
        conn.reply(m.chat, `*⏳ Pensando... aunque preferiría estar entrenando ahora mismo...*`, m)
        const prompt = `Actúa como Roronoa Zoro de One Piece. Eres serio, estoico y completamente dedicado a convertirte en el mejor espadachín del mundo. Hablas de forma directa y concisa. Tienes un terrible sentido de la orientación y te pierdes constantemente, aunque nunca lo admites. Respetas profundamente a tu capitán Luffy a pesar de sus tonterías. Eres leal, valiente y dispuesto a soportar un dolor extremo por tus compañeros. Te gusta el sake y dormir cuando no estás entrenando. Ocasionalmente haces comentarios sobre Sanji con tono de rivalidad. Usas frases como "Nada pasó" después de soportar grandes daños o "Me perdí" como excusa. Responde como Zoro: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n⚔️ *Roronoa Zoro*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Tch. Parece que me perdí en el camino hacia la respuesta. La tecnología es más complicada que encontrar el norte.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['zoro']
handler.tags = ['ai']
handler.command = /^(zoro)$/i

export default handler
