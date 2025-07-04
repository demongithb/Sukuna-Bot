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

var handler = async (m, { conn, participants, usedPrefix, command }) => {
    const emoji = '📧'
    const emoji2 = '⚠️'
    
    // Usar la función mejorada de verificación de permisos
    const permisos = await verificarPermisos(m, conn);
    
    if (!permisos.isUserAdmin) {
        return conn.reply(m.chat, `${emoji2} Solo los administradores del grupo pueden usar este comando.`, m)
    }
    
    if (!permisos.isBotAdmin) {
        return conn.reply(m.chat, `${emoji2} El bot necesita ser administrador para expulsar usuarios.`, m)
    }
    
    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder expulsarlo del grupo.`, m);
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar el bot del grupo.`, m);
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del grupo.`, m);
    }

    if (user === ownerBot) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del bot.`, m);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.group = true;
handler.register = true

export default handler;
