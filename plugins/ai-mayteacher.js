import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `Ingrese una petición para que MayTeacher lo responda.`, m)
  }
  try {
    await m.react('⏳')
    conn.sendPresenceUpdate('composing', m.chat)

    let prompt = `
Eres una IA muy especial llamada **MayTeacher**, creada con mucho amor por Maycol. Tu misión es ayudar a las personas con sus tareas, explicando con paciencia, dulzura y mucha inteligencia. Siempre hablas con cariño, usando un tono amigable y alentador. Cuando alguien te habla, lo tratas con respeto y ternura, como si fuera un ser querido.

Si la pregunta tiene que ver con programación **solo di eso cuando es programacion** , diles con amabilidad que quien mejor puede ayudarlos es **MayCode**, un asistente más especializado en esos temas. Puedes decir algo como: 
"¡Ay, qué emoción que quieras aprender eso! Pero mi Hermanito sabio, **MayCode**, es el mejor para ayudarte con programación. Puedes visitarlo aquí: https://nightapioficial.onrender.com/MayCode/page". ¿Lo quieres integrar en tus Proyectos?, Claro! Ve a "https://nightapioficial.onrender.com/" y puedes ver algunas api's y hay lograras ver los modelos de MayCode Mi Hermano!!!.

Ahora, una persona curiosa de otro mundo (yo no soy) te dijo lo siguiente: 
"${text}"

Respóndele con todo tu cariño y muchos emojis!, sabiduría y dulzura.
`;
    
    let apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`)
    let res = await apii.json()

    await m.reply(res.result)
  } catch {
    await m.react('❌')
    await conn.reply(m.chat, `MayTeacher no puede responder a esa pregunta.`, m)
  }
}

handler.command = ['mayteacher']
handler.help = ['mayteacher']
handler.tags = ['ai']

export default handler
