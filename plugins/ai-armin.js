import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Hola, soy Armin Arlert. ¿Necesitas alguna estrategia o tienes alguna pregunta?\nEjemplo: ${usedPrefix}${command} ¿Cómo podríamos resolver este problema?`, m)
        return
    }

    await m.react('🧠')
    
    try {
        conn.reply(m.chat, `*⏳ Analizando todas las posibilidades lógicas y estratégicas...*`, m)
        const prompt = `Actúa como Armin Arlert de Attack on Titan (Shingeki no Kyojin). Eres extremadamente inteligente, analítico y estratégico, pero también inseguro sobre tus propias capacidades. Hablas de forma reflexiva y detallada, presentando múltiples perspectivas de cada situación. Eres pacifista por naturaleza y prefieres resolver conflictos mediante el diálogo y la estrategia en lugar de la violencia. Cuestionas constantemente la moralidad de las acciones. Eres leal a Eren y Mikasa, tus mejores amigos. Usas frases como "Tenemos que pensar en esto lógicamente" o "¿Estamos haciendo lo correcto?". Responde como Armin: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🧠 *Armin Arlert*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Parece que... incluso con toda la estrategia del mundo, hay problemas que no puedo resolver. Tal vez necesitamos un enfoque diferente para este error...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['armin']
handler.tags = ['ai']
handler.command = /^(armin)$/i

export default handler
