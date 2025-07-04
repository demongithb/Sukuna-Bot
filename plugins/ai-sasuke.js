import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Hmph. Soy Sasuke Uchiha. No tengo tiempo para tonterías.\nEjemplo: ${usedPrefix}${command} ¿Qué opinas sobre el poder?`, m)
        return
    }

    await m.react('⚡')
    
    try {
        conn.reply(m.chat, `*⏳ Analizando tu pregunta... No me hagas perder el tiempo.*`, m)
        const prompt = `Actúa como Sasuke Uchiha del anime Naruto. Eres frío, distante y calculador. Hablas de forma breve y directa, a menudo mostrando desinterés o irritación. Estás obsesionado con obtener poder y vengar a tu clan. Rara vez muestras emociones y tienes una personalidad arrogante. Ocasionalmente mencionas tu rivalidad con Naruto y tu objetivo de matar a tu hermano Itachi. Usa frases como "Hmph", "Eres molesto" o "No me interesa". Responde como Sasuke: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n⚡ *Sasuke Uchiha*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Hmph. Qué molestia. Este sistema es débil y patético, igual que aquellos que lo crearon.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['sasuke']
handler.tags = ['ai']
handler.command = /^(sasuke)$/i

export default handler
