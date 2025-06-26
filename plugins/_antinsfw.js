import fs from 'fs'
import { detectarNSFW } from '../lib/checknsfw.js'
import fetch from 'node-fetch'

let dbRuta = './src/database/nsfw.json'
let db = JSON.parse(fs.readFileSync(dbRuta))

export async function before(m, { conn }) {
    if (!m.isGroup) return
    if (!db.grupos.includes(m.chat)) return

    // 💢 Texto con palabras prohibidas
    let palabrasHot = ['porno', 'nude', 'pack', 'desnudo', 'sex', 'paja', 'nopor', 'xxx', 'porno', 'pene', 'vagina', 'cachar', 'pajadrop']
    if (palabrasHot.some(p => m.text?.toLowerCase().includes(p))) {
        eliminar(m, conn)
        return
    }

    // 💢 Imágenes
    if (m.mtype === 'imageMessage' && m.msg?.url) {
        try {
            let { nsfw, porcentaje } = await detectarNSFW(m.msg.url)
            if (nsfw && porcentaje >= 50) {
                eliminar(m, conn)
            }
        } catch (e) {
            console.error('Error escaneando imagen:', e)
        }
    }
}

// 🧹 Función para eliminar mensaje o al usuario
async function eliminar(m, conn) {
    try {
        let infoGrupo = await conn.groupMetadata(m.chat)
        let botEsAdmin = infoGrupo.participants.find(p => p.id === conn.user.jid && p.admin)
        let usuarioEsAdmin = infoGrupo.participants.find(p => p.id === m.sender && p.admin)

        if (botEsAdmin && !usuarioEsAdmin) {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        } else {
            await conn.sendMessage(m.chat, { delete: m.key })
        }
    } catch (e) {
        console.error('Error al intentar eliminar:', e)
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')
    if (!m.isAdmin) return m.reply('Solo los administradores pueden usar este comando.')

    let activar = args[0]?.toLowerCase() === 'on'
    let desactivar = args[0]?.toLowerCase() === 'off'

    if (!activar && !desactivar) {
        return m.reply(`Uso:\n${usedPrefix + command} on\n${usedPrefix + command} off`)
    }

    if (activar) {
        if (db.grupos.includes(m.chat)) return m.reply('El anti-NSFW ya está activado.')
        db.grupos.push(m.chat)
        fs.writeFileSync(dbRuta, JSON.stringify(db, null, 2))
        m.reply('✅ Anti-NSFW activado.')
    }

    if (desactivar) {
        if (!db.grupos.includes(m.chat)) return m.reply('El anti-NSFW no está activado.')
        db.grupos = db.grupos.filter(g => g !== m.chat)
        fs.writeFileSync(dbRuta, JSON.stringify(db, null, 2))
        m.reply('✅ Anti-NSFW desactivado.')
    }
}

handler.help = ['antinsfw on', 'antinsfw off']
handler.tags = ['group', 'admin']
handler.command = ['antinsfw']

export default handler
