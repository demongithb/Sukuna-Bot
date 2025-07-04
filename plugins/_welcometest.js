let handler = async (m, { conn, args, command, usedPrefix, groupMetadata }) => {
  if (!m.isGroup) return m.reply('👻 Este comando solo funciona en grupos, espíritu.')
  let chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return m.reply('👻 El sistema de bienvenida no está activado en este grupo.')

  let type = args[0]?.toLowerCase()
  if (!['join', 'leave'].includes(type)) {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} join\n${usedPrefix + command} leave`)
  }

  const fakeUser = m.sender
  const fakeId = fakeUser.split('@')[0]
  const pp = await conn.profilePictureUrl(fakeUser, 'image').catch(_ =>
    'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
  const img = await (await fetch(pp)).buffer()

  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Hanako-Test"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Hanako;Test;;;\nFN:HanakoTest\nitem1.TEL;waid=${fakeId}:${fakeId}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }

  let groupSize = groupMetadata.participants.length
  if (type === 'join') groupSize++
  else if (type === 'leave') groupSize--

  const txtJoin = '╭─━━━⊰ゲ⊱━━━─╮\n      🕯️ Nuevo Espíritu\n╰─━━━⊰ゲ⊱━━━─╯'
  const txtLeave = '╭─━━━⊰ゲ⊱━━━─╮\n      🕯️ Espíritu Perdido\n╰─━━━⊰ゲ⊱━━━─╯'

  if (type === 'join') {
    const bienvenida = `
✧･ﾟ: *✧･ﾟ:* 𝒲𝑒𝓁𝒸𝑜𝓂𝑒 *:･ﾟ✧*:･ﾟ✧
𓂃𓈒𓏸 Bienvenido al reino de ${groupMetadata.subject}
➤ Espíritu invocado: @${fakeId}
${global.welcom1}

✦ Población sobrenatural: ${groupSize} almas
✧ Usa *#help* para invocar mis habilidades~
✧ Que tu estancia sea mágica y misteriosa...
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()

    await conn.sendMini(m.chat, txtJoin, 'Hanako-Bot', bienvenida, img, img, 'https://instagram.com', fkontak)
  }

  if (type === 'leave') {
    const despedida = `
✧･ﾟ: *✧･ﾟ:* 𝒢𝑜𝑜𝒹𝒷𝓎𝑒 *:･ﾟ✧*:･ﾟ✧
𓂃𓈒𓏸 Un espíritu ha partido de ${groupMetadata.subject}
➤ Espíritu perdido: @${fakeId}
${global.welcom2}

✦ Ahora quedamos: ${groupSize} espíritus
✧ Vuelve cuando la luna esté llena...
✧ Invócame con *#help* si me necesitas...
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()

    await conn.sendMini(m.chat, txtLeave, 'Hanako-Bot', despedida, img, img, 'https://instagram.com', fkontak)
  }
}

handler.help = ['hanakotest <join|leave>']
handler.tags = ['group', 'fun']
handler.command = ['welcometest']

export default handler
