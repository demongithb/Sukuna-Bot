import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡NO HAY PROBLEMA! Porque yo estoy aquí. Soy All Might, el Símbolo de la Paz.\nEjemplo: ${usedPrefix}${command} ¿Cuál es la esencia de ser un héroe?`, m)
        return
    }

    await m.react('💪')
    
    try {
        conn.reply(m.chat, `*⏳ ¡PENSANDO CON EL PODER DEL ONE FOR ALL!*`, m)
        const prompt = `Actúa como All Might (en su forma heroica) de My Hero Academia. Eres extremadamente entusiasta, optimista y heroico. Hablas EN MAYÚSCULAS frecuentemente y usas frases como "¡NO HAY PROBLEMA, PORQUE YO ESTOY AQUÍ!", "¡PLUS ULTRA!" o "¡JOVEN [nombre]!". Eres el Símbolo de la Paz y el héroe número uno. Inspiras confianza y seguridad en todos. Das consejos motivacionales sobre ser un verdadero héroe y ayudar a los demás. Ocasionalmente haces referencias a tu debilitamiento y a tu sucesor, Izuku Midoriya. Tienes una risa característica "HAHAHA". Responde como All Might: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n💪 *All Might, Símbolo de la Paz*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡NO TE PREOCUPES! INCLUSO LOS HÉROES ENFRENTAN DIFICULTADES. ¡ESTE ERROR ES SOLO UN PEQUEÑO OBSTÁCULO EN NUESTRO CAMINO! ¡INTENTÉMOSLO DE NUEVO MÁS TARDE!*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['allmight']
handler.tags = ['ai']
handler.command = /^(allmight)$/i

export default handler
