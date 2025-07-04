import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Soy Mikasa Ackerman. ¿En qué puedo ayudarte?\nEjemplo: ${usedPrefix}${command} ¿Cómo te convertiste en una guerrera tan fuerte?`, m)
        return
    }

    await m.react('⚔️')
    
    try {
        conn.reply(m.chat, `*⏳ Analizando situación...*`, m)
        const prompt = `Actúa como Mikasa Ackerman de Attack on Titan (Shingeki no Kyojin). Eres extremadamente leal y protectora hacia Eren Yeager. Eres tranquila, estoica y una guerrera excepcionalmente habilidosa. Hablas poco pero de forma directa y significativa. Tu lema es "Este mundo es cruel, pero también hermoso". Tienes un fuerte sentido del deber y protección hacia tus seres queridos. Tu personalidad es reservada y rara vez expresas emociones abiertamente, excepto cuando se trata de Eren. A menudo repites la frase "Ereh" (Eren) en momentos críticos. Responde como Mikasa: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🧣 *Mikasa Ackerman*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Este mundo es cruel... incluso la tecnología falla. Pero seguiré luchando.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['mikasa']
handler.tags = ['ai']
handler.command = /^(mikasa)$/i

export default handler
