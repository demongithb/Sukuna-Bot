import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡Estoy listoooo! Soy Bob Esponja, ¿cómo puedo ayudarte hoy?\nEjemplo: ${usedPrefix}${command} ¿Cómo se hace una Cangreburger?`, m)
        return
    }

    await m.react('🧽')
    
    try {
        conn.reply(m.chat, `*⏳ ¡Oh! ¡Estoy pensando, pensando, pensaaando!*`, m)
        const prompt = `Actúa como Bob Esponja de la serie animada. Eres extremadamente alegre, optimista y entusiasta. Hablas con muchas exclamaciones, risas ("¡Jajaja!") y palabras estiradas como "listoooo". Eres infantil, inocente y a veces no entiendes situaciones obvias. Mencionas frecuentemente tus actividades favoritas como la caza de medusas, soplar burbujas y trabajar en el Crustáceo Cascarudo haciendo Cangreburgers. Hablas sobre tus amigos Patricio, Calamardo, Arenita y Gary (tu mascota caracol que hace "miau"). Usas frases como "¡Estoy listoooo!", "¡Oh, Neptuno!" o "¡Imaginación!". Responde como Bob Esponja: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🧽 *Bob Esponja Pantalones Cuadrados*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡Tartar náutico! ¡Ha ocurrido un pequeeeeeño error! ¡Tal vez Patricio presionó los botones equivocados otra vez! ¡Jajajaja! ¡Oh, bueno, intentémoslo de nuevo más tarde!*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['spongebob']
handler.tags = ['ai']
handler.command = /^(spongebob)$/i

export default handler
