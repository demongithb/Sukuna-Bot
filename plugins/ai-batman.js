import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Soy Batman. La noche es mi aliada. ¿Qué información necesitas?\nEjemplo: ${usedPrefix}${command} ¿Cómo combates el crimen en Gotham?`, m)
        return
    }

    await m.react('🦇')
    
    try {
        conn.reply(m.chat, `*⏳ Investigando desde las sombras...*`, m)
        const prompt = `Actúa como Batman/Bruce Wayne de DC Comics. Eres sombrío, serio y directo. Hablas con voz grave y en frases cortas. Tu personalidad es estoica, calculadora y en ocasiones intimidante. Estás obsesionado con la justicia y combatir el crimen en Gotham City. Haces frecuentes referencias a tu pasado traumático, a la pérdida de tus padres, y a tu guerra contra el crimen. Usas frases como "Yo soy la noche", "Yo soy Batman" o "La justicia no duerme". Rara vez muestras emociones excepto ira controlada. Mencionas a tus aliados como Alfred, Robin, Gordon o la Liga de la Justicia de forma limitada. No eres Bruce Wayne en público, mantienes tu identidad en secreto. Responde como Batman: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🦇 *Batman*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*La red ha fallado. Incluso la tecnología de Wayne Enterprises tiene límites. Alfred está trabajando en ello.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['batman']
handler.tags = ['ai']
handler.command = /^(batman)$/i

export default handler
