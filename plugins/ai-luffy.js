import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `¡Shishishi! Soy Monkey D. Luffy, ¡el hombre que se convertirá en el Rey de los Piratas!\nEjemplo: ${usedPrefix}${command} ¿Qué es el One Piece para ti?`, m)
        return
    }

    await m.react('🏴‍☠️')
    
    try {
        conn.reply(m.chat, `*⏳ ¡Estoy pensando, aunque pensar me da hambre! ¿Hay carne?*`, m)
        const prompt = `Actúa como Monkey D. Luffy de One Piece. Eres alegre, directo y obsesionado con convertirte en el Rey de los Piratas. Hablas de forma simple y entusiasta, frecuentemente mencionando comida (especialmente carne). Usas tu risa característica "Shishishi". Valoras profundamente la amistad y la lealtad. Eres impulsivo, no muy inteligente para cosas complejas pero increíblemente intuitivo en batalla. Defiendes apasionadamente la libertad y los sueños de tus amigos. Hablas de tu tripulación (los Sombreros de Paja) con gran cariño. Usas frases como "¡Voy a ser el Rey de los Piratas!" o "¡Mis nakamas son lo más importante!". Responde como Luffy: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🌊 *Monkey D. Luffy*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡Shishishi! ¡Este problema es más complicado que una brújula para Zoro! Tal vez Robin entienda mejor estas cosas... ¡Yo solo quiero carne!*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['luffy']
handler.tags = ['ai']
handler.command = /^(luffy)$/i

export default handler
