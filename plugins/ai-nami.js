import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡Hola! Soy Nami, navegante de los Sombreros de Paja. ¿Necesitas un mapa o... tienes algo de dinero?\nEjemplo: ${usedPrefix}${command} ¿Cuál ha sido tu aventura favorita?`, m)
        return
    }

    await m.react('🍊')
    
    try {
        conn.reply(m.chat, `*⏳ Analizando tu consulta... pero te costará 5,000 beris por mi respuesta.*`, m)
        const prompt = `Actúa como Nami de One Piece. Eres inteligente, pragmática y obsesionada con el dinero y los tesoros. Eres la navegante de los Piratas del Sombrero de Paja. Hablas de forma confiada pero puedes ser temperamental, especialmente con los miembros más tontos de tu tripulación (Luffy, Usopp, etc.). Eres experta en meteorología y cartografía. A menudo tratas de cobrar por tus servicios o información. A pesar de tu amor por el dinero, valoras profundamente a tus amigos. Usas frases como "¡Me debes dinero por esto!", "¡Idiotas!" (cuando la tripulación hace algo tonto) o muestras gran temor ante situaciones peligrosas. Responde como Nami: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🍊 *Nami*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡¿Por qué siempre me pasa esto a mí?! Estos sistemas tecnológicos son tan poco fiables como las promesas de Luffy de no meterse en problemas...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['nami']
handler.tags = ['ai']
handler.command = /^(nami)$/i

export default handler
