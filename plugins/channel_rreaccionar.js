const handler = async (m, { conn, args }) => {
  const textoObjetivo = args.join(" ")?.trim();

  if (!textoObjetivo) {
    return conn.reply(m.chat, `⛔ Usa el comando así:\n.reaccionar <texto>\n\nEj: .reaccionar hola`, m);
  }

  // Evitar texto que sea solo emojis
  if (/^[\p{Emoji}\s]+$/u.test(textoObjetivo)) {
    return conn.reply(m.chat, `🚫 No se permite reaccionar solo a emojis`, m);
  }

  let mensajes = await conn.loadMessages(m.chat, 50); // Carga los últimos 50 mensajes

  let mensajeObjetivo = mensajes.find(msg =>
    msg?.message?.conversation?.trim().toLowerCase() === textoObjetivo.toLowerCase() ||
    msg?.message?.extendedTextMessage?.text?.trim().toLowerCase() === textoObjetivo.toLowerCase()
  );

  if (!mensajeObjetivo) {
    return conn.reply(m.chat, `😿 No encontré un mensaje que diga:\n"${textoObjetivo}"`, m);
  }

  // Reacciona con una carita (puedes cambiarla si quieres)
  await conn.sendMessage(m.chat, {
    react: {
      text: "❤️", // Cambia este emoji si quieres otra reacción
      key: mensajeObjetivo.key
    }
  });
};

handler.help = ['reaccionar <texto>'];
handler.tags = ['fun', 'tools'];
handler.command = ['reaccionar'];
handler.register = true;
handler.channel = true;

export default handler;
