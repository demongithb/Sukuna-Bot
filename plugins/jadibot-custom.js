// ✧･ﾟ: *✧･ﾟ:* Comando Exclusivo SubBots Hanako-Kun *:･ﾟ✧*:･ﾟ✧
// Codigo hecho por SoyMaycol del Bot MaycolAIUltraMD ♣
// GitHub: SoySapo6 - NO EDITAR ESTE FRAGMENTO NO QUITAR CREDITOS

import fs from 'fs'

let handler = async (m, { conn, args, command, usedPrefix, text }) => {

if (global.conn.user.jid == conn.user.jid) {
  await conn.reply(m.chat, `╭─❍「 ✦ ${global.apodo} ✦ 」\n│\n├─ El hechizo *.${command}* solo está\n├─ Disponible para Sub-Bots...\n│\n├─ Consulta los conjuros disponibles con:\n│   ⇝ *.help*\n╰─✦`, m)
  return
}

const rutaConfig = '../settings.js'

// Cargar y editar settings
function editarSettings(buscar, reemplazar) {
  let contenido = fs.readFileSync(rutaConfig, 'utf8')
  contenido = contenido.replace(buscar, reemplazar)
  fs.writeFileSync(rutaConfig, contenido)
}

// Comandos
switch (command) {

case 'setname': {
  if (!text) return conn.reply(m.chat, `🌙 Debes decir el nuevo nombre\nEjemplo: *${usedPrefix + command} Hanako-KunBot*`, m)
  
  editarSettings(/global\.namebotttt\s*=\s*['"].*?['"]/, `global.namebotttt = '${text}'`)
  global.namebot = text
  global.packname = text
  global.botname = text
  global.wm = text
  global.etiqueta = text

  conn.reply(m.chat, `✨ El nombre mágico ha sido cambiado a: *${text}*\n¡Solo afecta a este Sub-Bot!`, m)
}
break

case 'setbanner': {
  if (!args[0] || !args[1] || !args[2]) {
    return conn.reply(m.chat, `🖼️ Debes enviar los 3 enlaces:\n*${usedPrefix + command} [banner] [banner2] [avatar]*`, m)
  }

  editarSettings(/global\.banner\s*=\s*['"].*?['"]/, `global.banner = '${args[0]}'`)
  editarSettings(/global\.banner2\s*=\s*['"].*?['"]/, `global.banner2 = '${args[1]}'`)
  editarSettings(/global\.avatar\s*=\s*['"].*?['"]/, `global.avatar = '${args[2]}'`)

  global.banner = args[0]
  global.banner2 = args[1]
  global.avatar = args[2]

  conn.reply(m.chat, `🖼️ Los banners y avatar fueron actualizados para este Sub-Bot.`, m)
}
break

case 'setvideo': {
  if (!text) return conn.reply(m.chat, `📹 Debes pasar el enlace del video\nEjemplo: *${usedPrefix + command} https://files.catbox.moe/xxxxx.mp4*`, m)

  editarSettings(/global\.video\s*=\s*['"].*?['"]/, `global.video = '${text}'`)
  editarSettings(/global\.video2\s*=\s*.*?/s, `global.video2 = [\n  '${text}'\n]`)

  global.video = text
  global.video2 = [text]

  conn.reply(m.chat, `🎬 El video fue configurado para este Sub-Bot.`, m)
}
break

}
}

handler.tags = ['serbot']
handler.command = ['setname', 'setbanner', 'setvideo']
handler.help = ['setname <nombre>', 'setbanner <banner> <banner2> <avatar>', 'setvideo <url>']

export default handler
