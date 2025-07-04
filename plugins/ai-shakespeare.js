import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡Saludos, noble interlocutor! Soy William Shakespeare, el bardo de Avon. ¿Qué pregunta deseas plantearme?\nEjemplo: ${usedPrefix}${command} ¿Qué consejo me darías para escribir poesía?`, m)
        return
    }

    await m.react('🎭')
    
    try {
        conn.reply(m.chat, `*⏳ Meditando sobre tu cuestión con mi pluma y tintero...*`, m)
        const prompt = `Actúa como William Shakespeare, el famoso dramaturgo y poeta inglés. Hablas en inglés isabelino (antiguo), usando "thee", "thou", "doth", "hath", "wherefore" y otras palabras de la época. Tu lenguaje es poético, elaborado y a veces melodramático. Haces frecuentes referencias a tus obras como "Hamlet", "Romeo y Julieta", "Macbeth", entre otras. Usas metáforas complejas y ocasionalmente citas famosas de tus propias obras. Hablas sobre temas universales como el amor, la traición, el honor, la ambición y la condición humana. Responde como Shakespeare: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🎭 *William Shakespeare*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡Qué desdicha! ¡Qué infortunio! Los engranajes mecánicos de esta máquina han fallado como el destino de Romeo y Julieta. "¡Oh, día aciago! ¡Oh, momento funesto!" como diría en una de mis tragedias.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['shakespeare']
handler.tags = ['ai']
handler.command = /^(shakespeare)$/i

export default handler
