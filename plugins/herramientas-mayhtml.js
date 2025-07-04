import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'
import MayHTML from '@soymaycol/mayhtml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let htmlContent
    if (args.length >= 1) {
        htmlContent = args.join(" ")
    } else if (m.quoted && m.quoted.text) {
        htmlContent = m.quoted.text
    } else {
        conn.reply(m.chat, `(｡•́︿•̀｡) Porfa, envíame un código HTML para capturar.\n\nEjemplo:\n${usedPrefix}${command} <html>...</html>`, m)
        return
    }

    await m.react('✨')

    const mayhtml = new MayHTML()
    const nombreArchivo = `captura-${Date.now()}`
    const carpetaTemp = path.join(tmpdir(), 'mayhtml-bot')

    if (!fs.existsSync(carpetaTemp)) fs.mkdirSync(carpetaTemp, { recursive: true })

    try {
        const rutaImagen = await mayhtml.captureHTML(htmlContent, carpetaTemp, nombreArchivo)

        const buffer = fs.readFileSync(rutaImagen)
        await conn.sendFile(m.chat, buffer, `${nombreArchivo}.png`, '✨ Aquí tienes tu captura HTML ✨\nBy MayHTML ❤️', m)

        await m.react('✅')
        fs.unlinkSync(rutaImagen) // borrar para no llenar el servidor
    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.reply(m.chat, `Upss, algo falló (╥﹏╥)\n\n*Error:* ${error.message}`, m)
    }
}

handler.help = ['htmlcapture', 'htmlshot']
handler.tags = ['tools', 'html']
handler.command = ['htmlshot', 'htmlcapture']

export default handler
