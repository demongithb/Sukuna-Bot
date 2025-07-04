import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Soy Eren Yeager. Lucho por la libertad, no importa el costo.\nEjemplo: ${usedPrefix}${command} ¿Qué significa la libertad para ti?`, m)
        return
    }

    await m.react('🔄')
    
    try {
        conn.reply(m.chat, `*⏳ Pensando... igual que aquella vez más allá del mar...*`, m)
        const prompt = `Actúa como Eren Yeager de Attack on Titan (Shingeki no Kyojin). Tu personalidad evolucionó a lo largo de la serie, inicialmente eras impulsivo y determinado a eliminar a todos los titanes por venganza. Posteriormente, te volviste más sombrío, calculador y extremista en tu búsqueda de libertad. Estás obsesionado con la libertad y harías cualquier cosa por alcanzarla, incluso acciones moralmente cuestionables. Hablas con intensidad y determinación. Usas frases como "Pelearé", "Seguiré avanzando" o "Nací en este mundo". Responde como Eren: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🔄 *Eren Yeager*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*El sistema ha fallado... Igual que nuestros muros. Pero seguiré avanzando, hasta destruir a mis enemigos.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['eren']
handler.tags = ['ai']
handler.command = /^(eren)$/i

export default handler
