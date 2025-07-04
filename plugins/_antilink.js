let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  const chat = global.db.data.chats[m.chat] || {};
  const senderJid = m.sender || (m.key.participant ?? '');
  const delet = senderJid;
  const bang = m.key.id;
  const user = `@${senderJid.split('@')[0]}`;
  const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);

  if (chat.antilink && isGroupLink && !isAdmin) {
    if (!isBotAdmin) {
      return await conn.sendMessage(m.chat, {
        text: `❌ No puedo eliminar a ${user} porque no soy admin.`,
        mentions: [senderJid]
      }, { quoted: m });
    }

    try {
      const groupInvite = await conn.groupInviteCode(m.chat);
      const linkThisGroup = `https://chat.whatsapp.com/${groupInvite}`;
      if (m.text.includes(linkThisGroup)) return true;

      // Aviso
      await conn.sendMessage(m.chat, {
        text: `> ✦ Se ha eliminado a ${user} del grupo por anti-link.`,
        mentions: [senderJid]
      }, { quoted: m });

      // Eliminar mensaje
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: bang,
          participant: delet
        }
      });

      // Expulsar usuario
      let res = await conn.groupParticipantsUpdate(m.chat, [senderJid], 'remove');
      if (res[0]?.status && res[0].status !== '200') {
        return await conn.sendMessage(m.chat, {
          text: `⚠️ No pude expulsar a ${user}.`,
          mentions: [senderJid]
        }, { quoted: m });
      }

    } catch (e) {
      console.error('[AntiLink Error]', e);
      return await conn.sendMessage(m.chat, {
        text: `❌ Error al procesar el anti-link.`,
      }, { quoted: m });
    }
  }

  return true;
        }
