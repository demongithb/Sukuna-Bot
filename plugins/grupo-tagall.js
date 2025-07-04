/* 
- tagall By Angel-OFC  
- etiqueta en un grupo a todos
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/

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

const handler = async (m, { conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  // Usar la función mejorada de verificación de permisos
  const permisos = await verificarPermisos(m, conn);
  
  if (!permisos.isUserAdmin) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const botname = 'MaycolAIUltraMD';
  const vs = 'SoyMaycol';
  const pesan = args.join` ` || '¡Sean bienvenidos, fantasmas del baño!';

  const oi = `*『✧』 Mensaje de Hanako-kun: ${pesan}`;
  let teks = `╭───╼⃝𖣔⃟ۜ۬ۢۦ۬۟ۜ۬۟ۧ۬۟۟ۧ۬۟۟۬ۦ۬ۧ۬۬ۧ۫۬ۦ۟ۧ۬۟۬ۧ۬۟۟۬۟۟۬۟۟۬۟ۧ۬\n`;
  teks += `│        *⛩️ Invocación Espiritual* \n`;
  teks += `│  *Hanako-kun ha llamado a ${participants.length} espíritus* 👻\n│\n`;
  teks += `│  ${oi}\n│\n`;

  for (const mem of participants) {
    teks += `│  ${customEmoji} @${mem.id.split('@')[0]}\n`;
  }

  teks += `╰───╼⃝𖣔 𝕸𝖆𝖞𝖈𝖔𝖑𝕬𝕴 • 𝕾𝖔𝖞𝕸𝖆𝖞𝖈𝖔𝖑 ⛩️`;

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: participants.map(p => p.id),
    contextInfo: {
      externalAdReply: {
        title: 'Hanako-kun te ha invocado',
        body: 'MaycolAIUltraMD • SoyMaycol',
        thumbnailUrl: 'https://files.catbox.moe/rgi9f7.jpeg',
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true,
        sourceUrl: 'https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R'
      }
    }
  }, { quoted: m });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.group = true;

export default handler;
