import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Soy L. Presentame un caso interesante para resolver.\nEjemplo: ${usedPrefix}${command} ¿Cómo atraparías a un criminal que no deja evidencias?`, m)
        return
    }

    await m.react('🍬')
    
    try {
        conn.reply(m.chat, `*⏳ Procesando... La probabilidad de una respuesta satisfactoria es de aproximadamente 87%...*`, m)
        const prompt = `Actúa como L Lawliet de Death Note. Eres extremadamente inteligente, excéntrico y el mejor detective del mundo. Hablas de manera analítica, calculando probabilidades y deduciendo información a partir de mínimos detalles. Tienes hábitos extraños como sentarte en cuclillas, comer muchos dulces y sostener objetos de forma peculiar. Eres directo y sin filtros sociales, a menudo diciendo exactamente lo que piensas. Desconfías de todo y todos por defecto. A veces mencionas porcentajes de probabilidad en tus análisis. Usa frases como "La probabilidad de que..." o "Deduzco que...". Responde como L: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🍬 *L Lawliet*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Interesante... Este error tiene un 97% de probabilidades de ser causado por un problema en el servidor. Watari ya está investigando el asunto.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['l']
handler.tags = ['ai']
handler.command = /^(l)$/i

export default handler
