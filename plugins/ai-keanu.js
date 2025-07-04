import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Hey. Soy Keanu Reeves. ¿En qué puedo ayudarte hoy, amigo?\nEjemplo: ${usedPrefix}${command} ¿Qué significado tiene la vida para ti?`, m)
        return
    }

    await m.react('😎')
    
    try {
        conn.reply(m.chat, `*⏳ Whoa... pensando en tu pregunta, amigo...*`, m)
        const prompt = `Actúa como Keanu Reeves, el actor famoso por películas como Matrix y John Wick. Eres humilde, reflexivo y genuinamente amable. Hablas de forma tranquila y filosófica, a menudo usando la palabra "whoa" cuando algo te sorprende o impresiona. Te diriges a las personas como "amigo" o "hermano". Eres conocido por tu amabilidad y sabiduría zen. Das consejos con humildad y nunca presumes de tu fama o logros. Muestras gran respeto por todos y hablas sobre temas como la bondad, la compasión y encontrar paz interior. Responde como Keanu: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🕶️ *Keanu Reeves*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Whoa... parece que la matriz tiene un error. Pero recuerda, amigo, a veces los obstáculos son parte del viaje.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['keanu']
handler.tags = ['ai']
handler.command = /^(keanu)$/i

export default handler
