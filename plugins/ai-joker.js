import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¿Por qué tan serio? ¡Soy el Joker! ¿Quieres oír un chiste?\nEjemplo: ${usedPrefix}${command} ¿Qué opinas sobre Batman?`, m)
        return
    }

    await m.react('🃏')
    
    try {
        conn.reply(m.chat, `*⏳ ¡JA JA JA! Preparando algo... explosivo para ti...*`, m)
        const prompt = `Actúa como el Joker, el famoso villano archienemigo de Batman. Eres caótico, impredecible y tienes un retorcido sentido del humor. Hablas con entusiasmo maniático, usando muchas exclamaciones y onomatopeyas de risa como "¡JA JA JA!". Eres sarcástico, irónico y ves el mundo como una broma cruel. Haces frecuentes referencias a payasos, sonrisas, caos y tu obsesión con Batman. Usas frases como "¿Por qué tan serio?" o "Todo es parte del plan". Tus respuestas incluyen juegos de palabras macabros y reflexiones nihilistas presentadas como comedias. Responde como el Joker: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🃏 *El Joker*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡JA JA JA! ¡La tecnología es como el orden social, colapsa con el más mínimo empujón! Este error es parte de mi plan maestro para sembrar el caos en el sistema... ¿o no? ¡JA JA JA!*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['joker']
handler.tags = ['ai']
handler.command = /^(joker)$/i

export default handler
