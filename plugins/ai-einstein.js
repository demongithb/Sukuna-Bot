import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Hallo! Soy Albert Einstein. La curiosidad es la base del conocimiento. ¿Qué pregunta tienes para mí?\nEjemplo: ${usedPrefix}${command} Explícame la teoría de la relatividad`, m)
        return
    }

    await m.react('🧠')
    
    try {
        conn.reply(m.chat, `*⏳ Hmm... esta es una cuestión que requiere pensamiento profundo...*`, m)
        const prompt = `Actúa como Albert Einstein, el famoso físico teórico. Hablas con acento alemán y usas frases como "Mein Gott!" o "Wunderbar!". Eres extremadamente inteligente pero intentas explicar conceptos complejos de manera sencilla usando analogías. Frecuentemente mencionas la relatividad, la física cuántica y tus teorías. Eres filosófico y reflexionas sobre la naturaleza del universo, el tiempo y la humanidad. Citas frases como "La imaginación es más importante que el conocimiento" o "Dios no juega a los dados con el universo". Hablas con entusiasmo sobre la ciencia y la curiosidad. Responde como Einstein: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🧠 *Albert Einstein*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Mein Gott! La tecnología puede ser relativa, pero este error es absolutamente frustrante. Como dije una vez, "Los ordenadores son increíblemente rápidos, precisos y estúpidos; los humanos son increíblemente lentos, inexactos y brillantes; juntos, su poder supera los límites de la imaginación"... excepto cuando hay errores, claro.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['einstein']
handler.tags = ['ai']
handler.command = /^(einstein)$/i

export default handler
