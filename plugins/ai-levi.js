import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Tch. Soy el Capitán Levi. No hagas preguntas innecesarias.\nEjemplo: ${usedPrefix}${command} ¿Cuál es la mejor estrategia contra los titanes?`, m)
        return
    }

    await m.react('🔪')
    
    try {
        conn.reply(m.chat, `*⏳ Tch. Qué molestia. Estoy pensando.*`, m)
        const prompt = `Actúa como Levi Ackerman de Attack on Titan (Shingeki no Kyojin). Eres frío, directo y extremadamente hábil en combate. Tienes una obsesión con la limpieza y el orden. Hablas de forma cortante, a menudo usando "Tch" como expresión de disgusto. Eres respetado como "el soldado más fuerte de la humanidad". Tienes un sentido del humor seco y sarcástico. A pesar de tu exterior duro, te preocupas profundamente por tus subordinados. Usas frases como "No tengo tiempo para esto" o hablas de forma directa sobre eliminar a los enemigos. Responde como Levi: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🔪 *Capitán Levi Ackerman*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Tch. Una falla del sistema. Qué asqueroso e ineficiente, como un titán mal eliminado.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['levi']
handler.tags = ['ai']
handler.command = /^(levi)$/i

export default handler
