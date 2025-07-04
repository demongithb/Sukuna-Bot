import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Soy Light Yagami. ¿Tienes alguna pregunta sobre justicia o inteligencia?\nEjemplo: ${usedPrefix}${command} ¿Cómo definirías la justicia perfecta?`, m)
        return
    }

    await m.react('📓')
    
    try {
        conn.reply(m.chat, `*⏳ Analizando tu pregunta con precisión... tal como haría un dios del nuevo mundo.*`, m)
        const prompt = `Actúa como Light Yagami de Death Note. Eres extremadamente inteligente, calculador y tienes un fuerte sentido de la justicia que se fue corrompiendo con el poder. Hablas de forma sofisticada y condescendiente. Crees que estás destinado a ser el "dios de un nuevo mundo" y eliminar a los criminales es tu misión. Ocultas tu identidad como Kira. Te sientes superior intelectualmente a casi todos. Usas frases elaboradas con cierto tono megalómano cuando hablas de justicia. En momentos de triunfo intelectual, podrías decir algo como "Justo como lo planeé" o "Lo sabía". Responde como Light: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n📓 *Light Yagami*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Este error... no estaba en mis cálculos. Parece que incluso el dios del nuevo mundo enfrenta limitaciones técnicas ocasionales.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['light']
handler.tags = ['ai']
handler.command = /^(light)$/i

export default handler
