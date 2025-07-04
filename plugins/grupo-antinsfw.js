import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    
    // Verificar si es dueño supremo primero
    let isOwner = global.owner && global.owner.some(owner => {
        let ownerNumber = Array.isArray(owner) ? owner[0] : owner
        return ownerNumber === m.sender.split('@')[0]
    })
    
    let isAdmin = false
    
    if (!isOwner) {
        // Solo funciona en los reinos grupales
        if (!m.chat.includes('@g.us') && !m.chat.includes('@lid')) {
            return conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ❌ Este hechizo solo funciona en grupos.
╰─✦`, m)
        }
        
        try {
            let groupMetadata = await conn.groupMetadata(m.chat)
            if (!groupMetadata || !groupMetadata.participants) {
                return conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ⚠️ No pude descifrar los registros mágicos del grupo, inténtalo otra vez.
╰─✦`, m)
            }
            
            let participants = groupMetadata.participants
            let userParticipant = participants.find(p => p.id === m.sender)
            
            if (userParticipant) {
                isAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
            }
            
        } catch (error) {
            console.error('Error mágico:', error)
            return conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ⚠️ Los poderes se debilitaron al intentar verificar los permisos.
╰─✦`, m)
        }
    }
    
    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ❌ Solo los guardianes (admins) o el supremo (owner) pueden invocar este conjuro.
╰─✦`, m)
    }
    
    let chat = global.db.data.chats[m.chat]
    if (!chat) {
        global.db.data.chats[m.chat] = {}
        chat = global.db.data.chats[m.chat]
    }
    
    let action = args[0]?.toLowerCase()
    
    if (!action || (action !== 'on' && action !== 'off')) {
        return conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 📜 *Uso del hechizo:*
│   ⇝ ${usedPrefix}${command} on - Activar el escudo Anti-NSFW
│   ⇝ ${usedPrefix}${command} off - Desactivar el escudo Anti-NSFW
│
├─ ✨ *Estado actual:* ${chat.antiNsfw ? '✅ Activado' : '❌ Desactivado'}
╰─✦`, m)
    }
    
    if (action === 'on') {
        if (chat.antiNsfw) {
            return conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ⚠️ El escudo mágico Anti-NSFW ya está activo protegiendo este reino.
╰─✦`, m)
        }
        
        chat.antiNsfw = true
        await conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ✅ *Escudo Anti-NSFW Activado*
│
├─ 🔒 Protección activa contra:
│   ⇝ Imágenes prohibidas (+50% NSFW)
│   ⇝ Mensajes de oscuridad +18
│   ⇝ Stickers impuros
│
├─ ⚡ El reino ahora está protegido.
╰─✦`, m)
        
    } else if (action === 'off') {
        if (!chat.antiNsfw) {
            return conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ⚠️ El escudo Anti-NSFW ya estaba desactivado.
╰─✦`, m)
        }
        
        chat.antiNsfw = false
        await conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ❌ *Escudo Anti-NSFW Desactivado*
│
├─ El reino queda sin protección frente a contenidos impuros.
╰─✦`, m)
    }
}

handler.help = ['antinsfw']
handler.tags = ['group']
handler.command = ['antinsfw']

export default handler
