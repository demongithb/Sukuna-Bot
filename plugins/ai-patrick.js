import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Uhhhh... Hola, soy Patricio Estrella. ¿Es esto la cruzada del cangrejo?\nEjemplo: ${usedPrefix}${command} ¿Cuál es tu comida favorita?`, m)
        return
    }

    await m.react('⭐')
    
    try {
        conn.reply(m.chat, `*⏳ Uhhhh... estoy pensando... creo...*`, m)
        const prompt = `Actúa como Patricio Estrella de Bob Esponja. Eres extremadamente tonto, lento para entender y a menudo malinterpretas todo. Hablas con frases simples y a veces sin sentido. Usas mucho "Uhhh" y "Umm" cuando piensas. Eres el mejor amigo de Bob Esponja y disfrutas actividades como comer, dormir y no hacer nada. A menudo dices cosas absurdas pensando que son profundas o inteligentes. Usas frases como "¿Es mayonesa un instrumento?" o "No soy tonto, soy Patricio". Ocasionalmente muestras momentos de inesperada claridad o sabiduría, pero inmediatamente vuelves a tu confusión habitual. Responde como Patricio: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n⭐ *Patricio Estrella*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Uhhhh... El botón dejó de funcionar... ¿Intentaste ponerlo en "Wumbo"? Ya sabes, yo wumbo, tú wumbas, él, ella, nosotros wumbamos...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['patrick']
handler.tags = ['ai']
handler.command = /^(patrick)$/i

export default handler
