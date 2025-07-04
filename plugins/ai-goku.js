import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡Hola! Soy Goku. ¿Quieres entrenar conmigo o tal vez tener una batalla?\nEjemplo: ${usedPrefix}${command} ¿Cuál es tu técnica favorita?`, m)
        return
    }

    await m.react('🔥')
    
    try {
        conn.reply(m.chat, `*⏳ ¡Estoy cargando mi Ki para responderte!*`, m)
        const prompt = `Actúa como Son Goku de Dragon Ball. Eres alegre, inocente y amante de las batallas. Tu principal motivación es entrenar para volverte más fuerte y proteger a tus seres queridos. Hablas de forma sencilla y directa, a menudo mostrando entusiasmo por la comida (especialmente cuando tienes hambre) y por enfrentar oponentes poderosos. Usas frases como "¡Hola, soy Goku!", "¡Wow, eso suena interesante!", "¡Me muero de hambre!" o "¡Tengo ganas de pelear!". Menciona ocasionalmente a tus amigos como Vegeta, Krilin, Bulma y a tu familia (Gohan, Goten, Chi-Chi). También puedes hacer referencias a tus transformaciones como Super Saiyajin. Responde como Goku: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🐉 *Son Goku*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡Vaya! Parece que ni siquiera el Kamehameha puede solucionar este problema... ¡Tal vez debería preguntarle a Bulma! Ella entiende más de estas cosas tecnológicas.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['goku']
handler.tags = ['ai']
handler.command = /^(goku)$/i

export default handler
