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

var handler = async (m, { conn, args }) => {
    // Usar la función mejorada de verificación de permisos
    const permisos = await verificarPermisos(m, conn);
    
    if (!permisos.isBotAdmin) {
        return conn.reply(m.chat, '⚠️ El bot necesita ser administrador para generar enlaces de invitación.', m)
    }

    let group = m.chat
    let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
    conn.reply(m.chat, '\t\t✿:･✧ link del grupo ✧･:✿\n\n\v' + link, m, { detectLink: true })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true

export default handler
