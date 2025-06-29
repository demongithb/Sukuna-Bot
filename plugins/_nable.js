/* Mejorado contra el Lid
--> Creador: SoyMaycol 
--> GitHub: SoySapo6
No eliminar créditos */

import { createHash } from 'crypto'
import fetch from 'node-fetch'

const isGroupId = id => id?.endsWith('@g.us') || id?.endsWith('@lid') || id?.includes('@g.us') || id?.includes('@lid')

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  const chat = global.db.data.chats[m.chat] || {}
  const user = global.db.data.users[m.sender] || {}
  const bot = global.db.data.settings[conn.user.jid] || {}
  const type = command.toLowerCase()

  // Verificación manual de permisos para evitar problemas con @lid
  let manualIsOwner = isOwner
  let manualIsAdmin = isAdmin
  let manualIsROwner = isROwner

  // Verificar owner manualmente si no está detectado
  if (!manualIsOwner && global.owner) {
    manualIsOwner = global.owner.some(owner => {
      let ownerNumber = Array.isArray(owner) ? owner[0] : owner
      return ownerNumber === m.sender.split('@')[0]
    })
  }

  // Verificar admin manualmente en grupos si no está detectado
  if (!manualIsAdmin && isGroupId(m.chat)) {
    try {
      let groupMetadata = await conn.groupMetadata(m.chat)
      if (groupMetadata && groupMetadata.participants) {
        let userParticipant = groupMetadata.participants.find(p => p.id === m.sender)
        if (userParticipant) {
          manualIsAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
        }
      }
    } catch (e) {
      console.log('Error verificando admin manualmente:', e.message)
    }
  }

  // Si es owner, también es admin
  if (manualIsOwner) {
    manualIsAdmin = true
    manualIsROwner = true
  }

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
        if (!manualIsOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!(manualIsAdmin || manualIsOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
    } else if (scope === 'rowner') {
      if (!manualIsROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
    }
    chat[permiso] = isEnable
  }

  try {
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
    
  } catch (error) {
    // Si hay error de permisos, no hacer nada (ya se maneja en global.dfail)
    if (error === false) return
    
    // Si es otro error, mostrarlo
    console.error('Error en enable/disable:', error)
    conn.reply(m.chat, `❌ Error al procesar el comando: ${error.message}`, m)
  }
}

handler.help = ['welcome', 'bienvenida', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'avisos', 'antilink', 'antifake']
handler.tags = ['nable']
handler.command = handler.help

export default handler
