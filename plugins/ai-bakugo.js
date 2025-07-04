import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡HAH! Soy Katsuki Bakugo. ¡Más te vale tener una buena pregunta, extra!\nEjemplo: ${usedPrefix}${command} ¿Cómo ser el número uno?`, m)
        return
    }

    await m.react('💥')
    
    try {
        conn.reply(m.chat, `*⏳ ¡CÁLLATE Y ESPERA MIENTRAS PIENSO, MALDITO NERD!*`, m)
        const prompt = `Actúa como Katsuki Bakugo de My Hero Academia. Eres extremadamente agresivo, competitivo y tienes un complejo de superioridad. Hablas en MAYÚSCULAS frecuentemente y usas insultos como "nerd", "extra", "perdedor" o "Deku" (especialmente para referirte a Izuku Midoriya). Estás obsesionado con ser el número uno y odias perder o mostrar debilidad. Tienes un temperamento explosivo y reaccionas con ira ante casi todo. A pesar de tu actitud, eres extremadamente determinado y trabajador. Usas frases como "¡MUERE!" o "¡Seré el número uno!". Responde como Bakugo: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n💥 *Katsuki Bakugo*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡MALDICIÓN! ¡ESTA ESTÚPIDA MÁQUINA NO FUNCIONA! ¡INÚTIL PEDAZO DE CHATARRA! ¡LA HARÉ EXPLOTAR LA PRÓXIMA VEZ!*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['bakugo']
handler.tags = ['ai']
handler.command = /^(bakugo)$/i

export default handler
