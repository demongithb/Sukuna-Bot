import { createHash } from 'crypto'
import fetch from 'node-fetch'

const isGroupId = id => id?.endsWith('@g.us') || id?.endsWith('@lid')

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  const chat = global.db.data.chats[m.chat] || {}
  const user = global.db.data.users[m.sender] || {}
  const bot = global.db.data.settings[conn.user.jid] || {}
  const type = command.toLowerCase()

  let isEnable
  if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false
  } else {
    const estado = chat[type] ? '✓ Activado' : '✗ Desactivado'
    return conn.reply(m.chat, `「✦」Solo un admin puede activar o desactivar *${command}*\n\n> ✐ *${usedPrefix}${command} on* para activar.\n> ✐ *${usedPrefix}${command} off* para desactivar.\n\n✧ Estado actual » *${estado}*`, m)
  }

  const checkPerms = (permiso, scope = 'group') => {
    if (scope === 'group') {
      if (!isGroupId(m.chat)) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
    } else if (scope === 'rowner') {
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
    }
    chat[permiso] = isEnable
  }

  switch (type) {
    case 'welcome': case 'bienvenida': checkPerms('welcome'); break
    case 'antilag': checkPerms('antiLag'); break
    case 'antiprivado': case 'antiprivate': checkPerms('antiPrivate', 'rowner'); bot.antiPrivate = isEnable; break
    case 'restrict': case 'restringir': checkPerms('restrict', 'rowner'); bot.restrict = isEnable; break
    case 'antibot': case 'antibots': checkPerms('antiBot'); break
    case 'autoaceptar': case 'aceptarauto': checkPerms('autoAceptar'); break
    case 'autorechazar': case 'rechazarauto': checkPerms('autoRechazar'); break
    case 'autoresponder': case 'autorespond': checkPerms('autoresponder'); break
    case 'antisubbots': case 'antibot2': checkPerms('antiBot2'); break
    case 'modoadmin': case 'soloadmin': checkPerms('modoadmin'); break
    case 'reaction': case 'reaccion': checkPerms('reaction'); break
    case 'nsfw': case 'modohorny': checkPerms('nsfw'); break
    case 'jadibotmd': case 'modejadibot': checkPerms('jadibotmd', 'rowner'); bot.jadibotmd = isEnable; break
    case 'detect': case 'avisos': checkPerms('detect'); break
    case 'antilink': checkPerms('antiLink'); break
    case 'antifake': checkPerms('antifake'); break
    default:
      return conn.reply(m.chat, `❌ Comando *${command}* no reconocido.`, m)
  }

  chat[type] = isEnable

  const status = isEnable ? 'activó ✅' : 'desactivó ❌'
  const scope = ['antiprivado', 'restrict', 'jadibotmd'].includes(type) ? 'globalmente en el bot' : 'para este chat'

  conn.reply(m.chat, `《✦》La función *${type}* se ${status} ${scope}`, m)
}

handler.help = ['welcome', 'bienvenida', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'avisos', 'antilink', 'antifake']
handler.tags = ['nable']
handler.command = handler.help

export default handler
