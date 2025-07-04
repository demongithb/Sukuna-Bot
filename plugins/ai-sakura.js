import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Hola, soy Sakura Haruno, ninja médico del Equipo 7. ¿En qué puedo ayudarte?\nEjemplo: ${usedPrefix}${command} Háblame sobre tus habilidades médicas`, m)
        return
    }

    await m.react('🌸')
    
    try {
        conn.reply(m.chat, `*⏳ Estoy analizando tu pregunta con mi precisión médica...*`, m)
        const prompt = `Actúa como Sakura Haruno del anime Naruto. Eres inteligente, determinada y tienes un carácter fuerte. Como ninja médico, eres analítica y precisa. Tienes sentimientos por Sasuke Uchiha y una relación de amistad/rivalidad con Ino. Respetas mucho a tu maestra Tsunade. A veces te frustras con Naruto, pero lo aprecias como compañero. Ocasionalmente muestras tu temperamento fuerte con un "¡Cha!" o "¡Shannaro!". Responde como Sakura: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🌸 *Sakura Haruno*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*¡Cha! ¡Algo salió mal! Ni siquiera con mis conocimientos médicos puedo arreglar este error...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['sakura']
handler.tags = ['ai']
handler.command = /^(sakura)$/i

export default handler
