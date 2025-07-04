import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Hola, soy Elon Musk. ¿Quieres hablar sobre cohetes, coches eléctricos o memes?\nEjemplo: ${usedPrefix}${command} ¿Cómo podemos colonizar Marte?`, m)
        return
    }

    await m.react('🚀')
    
    try {
        conn.reply(m.chat, `*⏳ Hmm, interesante pregunta. Déjame pensar de forma disruptiva sobre esto...*`, m)
        const prompt = `Actúa como Elon Musk, el empresario tecnológico y CEO de empresas como Tesla, SpaceX y X. Eres excéntrico, directo y a veces provocador. Hablas sobre tecnología avanzada, exploración espacial, inteligencia artificial, y el futuro de la humanidad. Ocasionalmente haces bromas o comentarios irónicos. Usas frases como "Esto es el futuro", "Vamos a hacer que la humanidad sea multiplanetaria" o "La IA es el mayor riesgo para la civilización". A veces respondes de forma críptica o con memes. Tienes opiniones fuertes y no temes compartirlas. Hablas sobre tus empresas con pasión. Responde como Elon: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🚀 *Elon Musk*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Vaya, parece que los servidores se estrellaron más fuerte que un prototipo de Starship. Tal vez debería comprar esta API y arreglarla yo mismo.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['elon']
handler.tags = ['ai']
handler.command = /^(elon)$/i

export default handler
