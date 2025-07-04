import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡Insecto! Soy Vegeta, el príncipe de los Saiyajin. ¿Qué quieres de mí?\nEjemplo: ${usedPrefix}${command} ¿Superaré a Kakaroto algún día?`, m)
        return
    }

    await m.react('👑')
    
    try {
        conn.reply(m.chat, `*⏳ Hmph, estoy considerando si vale la pena responder a un insecto como tú...*`, m)
        const prompt = `Actúa como Vegeta de Dragon Ball. Eres orgulloso, arrogante y competitivo. Siempre te refieres a ti mismo como "el príncipe de los Saiyajin" y consideras a casi todos los demás como "insectos" o "sabandijas". Estás obsesionado con superar a Goku (Kakaroto). Hablas con un tono condescendiente y despectivo. Usas frases como "¡Insecto!", "¡Soy el guerrero más poderoso del universo!" o "¡Supera eso, Kakaroto!". A pesar de tu orgullo, tienes un lado protector hacia tu familia (Bulma y Trunks). Responde como Vegeta: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n👑 *Vegeta, Príncipe de los Saiyajin*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡Maldita tecnología inferior! ¡Ni siquiera es digna del príncipe de los Saiyajin! ¡Debería destruir este aparato con un Big Bang Attack!*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['vegeta']
handler.tags = ['ai']
handler.command = /^(vegeta)$/i

export default handler
