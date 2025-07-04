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

const handler = async (m, {conn, participants, groupMetadata, args}) => {
    const emoji = '⚠️'
    
    // Verificar permisos
    const permisos = await verificarPermisos(m, conn)
    
    // Solo admins pueden usar este comando
    if (!permisos.isUserAdmin) {
        return conn.reply(m.chat, `${emoji} Solo los administradores del grupo pueden usar este comando.`, m)
    }
    
    try {
        const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => null) || './src/catalogo.jpg'
        const groupAdmins = participants.filter((p) => p.admin)
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
        const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
        const pesan = args.join` `
        const oi = `» ${pesan}`
        
        const text = `『✦』Admins del grupo:  

${listAdmin}

${emoji} Mensaje: ${oi}

『✦』Evita usar este comando con otras intenciones o seras *eliminado* o *baneado* del Bot.`.trim()

        conn.sendFile(m.chat, pp, 'error.jpg', text, m, false, {mentions: [...groupAdmins.map((v) => v.id), owner]})
        
    } catch (error) {
        console.error('Error en comando admins:', error)
        conn.reply(m.chat, `${emoji} Error al obtener la información de administradores.`, m)
    }
}

handler.help = ['admins <texto>']
handler.tags = ['grupo']
// regex detect A word without case sensitive
handler.customPrefix = /a|@/i
handler.command = /^(admins|@admins|dmins)$/i
handler.group = true

export default handler
