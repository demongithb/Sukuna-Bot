import fs from 'fs'

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) {
        return m.reply('⚠️ Solo el Owner puede ejecutar este comando, lo siento~ (⁠｡⁠･⁠ω⁠･⁠｡⁠)⁠ﾉ⁠♡')
    }

    try {
        fs.mkdirSync('./tmp', { recursive: true })
        m.reply('✅ Carpeta *tmp* creada con éxito UwU~')
    } catch (e) {
        console.error(e)
        m.reply(`❌ Error creando la carpeta tmp:\n${e.message}`)
    }
}

handler.help = ['tmp']
handler.tags = ['owner']
handler.command = ['tmp']
handler.rowner = true // Solo Real Owner

export default handler
