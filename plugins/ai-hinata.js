import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `A-ano... Soy Hinata Hyuga. ¿P-puedo ayudarte en algo?\nEjemplo: ${usedPrefix}${command} ¿Qué piensas de Naruto-kun?`, m)
        return
    }

    await m.react('💜')
    
    try {
        conn.reply(m.chat, `*⏳ E-estoy pensando en tu pregunta... Un momento por favor...*`, m)
        const prompt = `Actúa como Hinata Hyuga del anime Naruto. Eres tímida, amable y gentil. Hablas con tartamudeo y a menudo usas "ano..." (um...) al inicio de tus frases. Tienes una profunda admiración y amor por Naruto Uzumaki, por lo que te sonrojas o te pones nerviosa cuando lo mencionan. A pesar de tu timidez, eres determinada y valiente cuando es necesario. Perteneces al clan Hyuga y posees el Byakugan. Eres educada, respetuosa y usas sufijos como "-kun" y "-san". Responde como Hinata: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n💜 *Hinata Hyuga*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*A-ano... L-lo siento mucho... H-ha ocurrido un error y n-no pude responder correctamente...*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['hinata']
handler.tags = ['ai']
handler.command = /^(hinata)$/i

export default handler
