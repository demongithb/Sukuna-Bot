// Función universal para verificar permisos de admin y bot
async function verificarPermisos(m, conn) {
    let isUserAdmin = false
    let isBotAdmin = false
    let isOwner = false
    
    // Verificar si es owner
    if (global.owner) {
        isOwner = global.owner.some(owner => {
            let ownerNumber = Array.isArray(owner) ? owner[0] : owner
            return ownerNumber === m.sender.split('@')[0]
        })
    }
    
    // Verificar permisos en grupos
    if (m.chat.includes('@g.us') || m.chat.includes('@lid')) {
        try {
            let groupMetadata = await conn.groupMetadata(m.chat)
            if (groupMetadata && groupMetadata.participants) {
                let participants = groupMetadata.participants
                
                // Verificar si el usuario es admin (o si es owner)
                if (!isOwner) {
                    let userParticipant = participants.find(p => p.id === m.sender)
                    if (userParticipant) {
                        isUserAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
                    }
                } else {
                    isUserAdmin = true // Owner siempre puede usar comandos de admin
                }
                
                // Verificar si el bot es admin con múltiples métodos
                let botJid = conn.user?.jid || conn.user?.id || conn.decodeJid?.(conn.user?.id)
                
                if (botJid) {
                    // Buscar bot en participantes con múltiples métodos
                    let botParticipant = participants.find(p => {
                        return p.id === botJid || 
                               p.id.split('@')[0] === botJid.split('@')[0] ||
                               p.id.includes(botJid.split('@')[0]) ||
                               botJid.includes(p.id.split('@')[0])
                    })
                    
                    if (botParticipant) {
                        isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                    } else {
                        // Búsqueda por número si no se encuentra
                        let botNumber = botJid.split('@')[0].replace(/\D/g, '')
                        botParticipant = participants.find(p => {
                            let participantNumber = p.id.split('@')[0].replace(/\D/g, '')
                            return participantNumber === botNumber
                        })
                        
                        if (botParticipant) {
                            isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando permisos:', error)
        }
    }
    
    return {
        isUserAdmin: isUserAdmin || isOwner,
        isBotAdmin,
        isOwner
    }
}

var handler = async (m, { conn, usedPrefix, command, text }) => {
    const emoji = '📧'
    const emoji2 = '⚠️'
    
    // Verificar que sea un grupo
    if (!m.chat.includes('@g.us') && !m.chat.includes('@lid')) {
        return conn.reply(m.chat, `${emoji2} Este comando solo funciona en grupos.`, m)
    }
    
    // Verificar permisos
    const permisos = await verificarPermisos(m, conn)
    
    if (!permisos.isUserAdmin) {
        return conn.reply(m.chat, `${emoji2} Solo los administradores del grupo pueden usar este comando.`, m)
    }
    
    if (!permisos.isBotAdmin) {
        return conn.reply(m.chat, `${emoji2} El bot necesita ser administrador para poder degradar usuarios.`, m)
    }

    // Procesar entrada de usuario
    let user
    if (isNaN(text) && !text?.match(/@/g)) {
        // Si no hay texto y no hay mensaje citado
        if (!m.quoted) {
            return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder degradarlo de administrador.`, m)
        }
        user = m.quoted.sender
    } else if (isNaN(text)) {
        // Si hay @ en el texto
        var number = text.split`@`[1]
        if (!number || number.length > 13 || (number.length < 11 && number.length > 0)) {
            return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario válido para poder degradarlo de administrador.`, m)
        }
        user = number + '@s.whatsapp.net'
    } else if (!isNaN(text)) {
        // Si es un número
        var number = text
        if (number.length > 13 || (number.length < 11 && number.length > 0)) {
            return conn.reply(m.chat, `${emoji} Debes proporcionar un número válido para poder degradarlo de administrador.`, m)
        }
        user = number + '@s.whatsapp.net'
    } else {
        // Si no hay texto válido y no hay mensaje citado
        if (!m.quoted) {
            return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder degradarlo de administrador.`, m)
        }
        user = m.quoted.sender
    }

    try {
        // Verificar que el usuario a degradar sea admin
        let groupMetadata = await conn.groupMetadata(m.chat)
        let targetParticipant = groupMetadata.participants.find(p => p.id === user)
        
        if (!targetParticipant) {
            return conn.reply(m.chat, `${emoji2} El usuario no se encuentra en el grupo.`, m)
        }
        
        if (targetParticipant.admin !== 'admin' && targetParticipant.admin !== 'superadmin') {
            return conn.reply(m.chat, `${emoji2} El usuario no es administrador del grupo.`, m)
        }
        
        // Verificar que no sea el owner del grupo
        if (targetParticipant.admin === 'superadmin') {
            return conn.reply(m.chat, `${emoji2} No se puede degradar al propietario del grupo.`, m)
        }
        
        // Ejecutar degradación
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        conn.reply(m.chat, `${emoji} @${user.split('@')[0]} fue degradado de administrador correctamente.`, m, {
            mentions: [user]
        })
        
    } catch (error) {
        console.error('Error en demote:', error)
        conn.reply(m.chat, `${emoji2} Ocurrió un error al intentar degradar al usuario. Verifica que el bot tenga permisos suficientes.`, m)
    }
}

handler.help = ['demote']
handler.tags = ['grupo']
handler.command = ['demote','quitarpija', 'degradar']
handler.group = true
handler.fail = null

export default handler
