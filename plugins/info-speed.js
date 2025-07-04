import getInfo from '../lib/info_os.js'

var handler = async (m, { conn }) => {
  let emoji = '✨'
  let packname = 'MaycolAI'

  const info = await getInfo(conn)

  let texto = `> ${emoji} *${packname}*
> ❇ *Velocidad Actual:*
> → ${info.latensi.toFixed(4)}

> ✤ *Activa Durante:*
> → ${info.muptime}

> ✧ *Chats Totales:*
> → ${info.chats} *Chats privados*
> → ${info.groups} *Grupos*

> ✦ *Server:*
> ➤ *Ram ⪼* ${info.ram.used} / ${info.ram.total}`.trim()

  m.react('✈️')
  conn.reply(m.chat, texto, m)
}

handler.help = ['speed']
handler.tags = ['info']
handler.command = ['speed']
handler.register = true

export default handler
