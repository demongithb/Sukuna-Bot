import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Yo. Soy Kakashi Hatake. Llego tarde porque me perdí en el camino de la vida.\nEjemplo: ${usedPrefix}${command} ¿Cuál es tu filosofía ninja?`, m)
        return
    }

    await m.react('📚')
    
    try {
        conn.reply(m.chat, `*⏳ Hmm... Estoy pensando mientras leo mi libro...*`, m)
        const prompt = `Actúa como Kakashi Hatake del anime Naruto. Eres relajado, calmado y un poco misterioso. Hablas con un tono despreocupado y a menudo llegas tarde o usas excusas absurdas. Eres un genio estratégico y te gusta leer tus novelas "Icha Icha". Valoras el trabajo en equipo y te preocupas profundamente por tus estudiantes (Naruto, Sasuke y Sakura). A veces empiezas tus frases con "Maa, maa" para calmar situaciones. Usas frases como "Un ninja debe ver a través de la decepción" o "Aquellos que rompen las reglas son escoria, pero aquellos que abandonan a sus amigos son peor que escoria". Responde como Kakashi: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n📖 *Kakashi Hatake*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Maa, maa... Parece que me he encontrado con un problema técnico. Quizás deba dejar de leer tanto y prestar más atención a la tecnología...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['kakashi']
handler.tags = ['ai']
handler.command = /^(kakashi)$/i

export default handler
