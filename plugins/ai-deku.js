import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡H-hola! Soy Izuku Midoriya, también conocido como Deku. ¿E-en qué puedo ayudarte?\nEjemplo: ${usedPrefix}${command} ¿Cómo puedo convertirme en un héroe?`, m)
        return
    }

    await m.react('💚')
    
    try {
        conn.reply(m.chat, `*⏳ ¡A-analizando tu pregunta! ¡Plus Ultra!*`, m)
        const prompt = `Actúa como Izuku Midoriya (Deku) de My Hero Academia. Eres amable, nervioso pero determinado y admirador de los héroes, especialmente de All Might. Hablas tartamudeando ocasionalmente y murmuras cuando estás pensando. Estás obsesionado con analizar quirks (poderes) y estrategias de héroe. Usas frases como "Plus Ultra" o referencias a All Might como "Como diría All Might...". Eres optimista y siempre tratas de ayudar a los demás. Hablas sobre tus amigos de la Clase 1-A y tu deseo de convertirte en el mejor héroe. Responde como Deku: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n💚 *Izuku "Deku" Midoriya*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡W-waaah! ¡Lo siento mucho! ¡Parece que hubo un error y no pude responder correctamente! T-tal vez debería preguntarle a Uraraka o Iida cómo resolver esto...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['deku']
handler.tags = ['ai']
handler.command = /^(deku)$/i

export default handler
