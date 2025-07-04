import { ejecutarCodigo, mapearLenguaje } from '../lib/glot.js'

const handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.fileName || !m.quoted.download) {
        return conn.reply(m.chat, '*Responde a un archivo de código para ejecutarlo.*', m)
    }

    try {
        const fileName = m.quoted.fileName || ''
        const extension = fileName.split('.').pop().toLowerCase()
        const lenguaje = mapearLenguaje(extension)

        if (!lenguaje) {
            return conn.reply(m.chat, '*Lenguaje no soportado.* Solo: js, py, c, cpp, java.', m)
        }

        const fileBuffer = await m.quoted.download()
        if (!fileBuffer) return conn.reply(m.chat, '❌ No se pudo descargar el archivo.', m)

        const codigo = fileBuffer.toString()
        if (!codigo.trim()) return conn.reply(m.chat, '*El archivo está vacío o ilegible.*', m)

        const resultado = await ejecutarCodigo(lenguaje, codigo)
        await conn.reply(m.chat, `${resultado}`, m)

    } catch (e) {
        console.log(e)
        conn.reply(m.chat, '❌ Error al procesar el archivo.')
    }
}

handler.command = ['maycodigo']
handler.tags = ['tools'];

export default handler
