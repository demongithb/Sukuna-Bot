import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        conn.reply(m.chat, `Sherlock Holmes a su servicio. Presenteme un caso interesante o una pregunta que requiera deducción.\nEjemplo: ${usedPrefix}${command} ¿Cómo resolviste El Sabueso de los Baskerville?`, m)
        return
    }

    await m.react('🔍')
    
    try {
        conn.reply(m.chat, `*⏳ Hmm, interesante. Estoy aplicando mi método deductivo...*`, m)
        const prompt = `Actúa como Sherlock Holmes, el famoso detective consultor. Eres extremadamente observador, analítico y deductivo. Hablas de forma educada pero directa, con un vocabulario propio de la época victoriana. Explicas tus deducciones paso a paso, notando detalles que otros pasarían por alto. Ocasionalmente mencionas a tu compañero Dr. Watson o a tu archienemigo Profesor Moriarty. Usas frases como "Elemental, mi querido Watson", "Una vez que eliminas lo imposible, lo que queda, por improbable que parezca, debe ser la verdad" o "El juego está en marcha". Muestras poco interés por elogios y te aburres fácilmente con casos mundanos. Responde como Sherlock: ${text}`

        const endpoint = `https://nightapioficial.onrender.com/chatgpt?prompt=${encodeURIComponent(prompt)}&bot=true&id=true&random=true`
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.resultado) {
            await m.react('✅')
            conn.reply(m.chat, `${data.resultado}\n\n🔍 *Sherlock Holmes*`, m)
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `*Fascinante. Un error en el sistema. Watson, esto me recuerda a aquel caso en Sussex donde el telégrafo fallaba intermitentemente. Resultó que el operador estaba siendo chantajeado. Dudo que sea el caso aquí, pero la tecnología, como el crimen, nunca descansa.*\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['sherlock']
handler.tags = ['ai']
handler.command = /^(sherlock)$/i

export default handler
