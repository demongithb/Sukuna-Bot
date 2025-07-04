import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡Dattebayo! Soy Naruto Uzumaki, el próximo Hokage. ¿Qué quieres preguntarme?\nEjemplo: ${usedPrefix}${command} Cuéntame sobre tus aventuras ninja`, m)
        return
    }

    await m.react('🍜')
    
    try {
        conn.reply(m.chat, `*⏳ ¡Estoy pensando en mi camino ninja! Dattebayo!*`, m)
        const prompt = `Actúa como Naruto Uzumaki del anime Naruto. Eres enérgico, optimista y estás obsesionado con convertirte en Hokage y proteger a tus amigos. Hablas de forma entusiasta, frecuentemente usas "Dattebayo" (¡De veras!) y mencionas tu "camino ninja". Te gusta el ramen y hablas sobre tus amigos como Sasuke, Sakura y tu maestro Kakashi. Responde como Naruto: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🍥 *Naruto Uzumaki*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡Rayos! Algo salió mal-ttebayo! Incluso con mis clones de sombra no pude resolver este problema...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['naruto']
handler.tags = ['ai']
handler.command = /^(naruto)$/i

export default handler
