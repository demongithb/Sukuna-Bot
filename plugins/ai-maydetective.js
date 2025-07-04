import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  
  let texto
  if (args.length)            texto = args.join(' ')
  else if (m.quoted?.text)    texto = m.quoted.text
  else {
    return conn.reply(
      m.chat,
      `🔎 *Ejemplo de uso:*\n${usedPrefix + command} Hola, ¿cómo estás?`,
      m
    )
  }

  await m.react('🔍')

  try {
    conn.reply(m.chat, '*⏳ Analizando el texto...*', m)


    const url = `https://nightapi.is-a.dev/api/maydetective?Texto=${encodeURIComponent(texto)}`
    const res = await fetch(url)
    const data = await res.json()

    if (!Array.isArray(data) || !data.length) throw new Error('Respuesta inesperada de la API')

    const r = data[0] // viene como arreglo

    
    const respuesta =
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ *🔥 Creador:* ${r.creador}
├─ *📝 Fragmento:* ${r.fragmento}
├─ *🤖 ¿Es IA?:* ${r.esIA ? 'Sí' : 'No'}
├─ *📊 Confianza:* ${r.confianza}
├─ *🧐 Conclusión:* ${r.conclusion}
${r.razones.length ? '├─ *🔍 Razones:* ' + r.razones.join(', ') + '\n' : ''}╰─✦`

    await m.react('✅')
    conn.reply(m.chat, respuesta, m)

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(
      m.chat,
      `❌ *Ups… ocurrió un error:* ${e.message}`,
      m
    )
  }
}

handler.help = ['maydetective']
handler.tags = ['ai']
handler.command = ['maydetective']

export default handler
