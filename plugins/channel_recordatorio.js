const handler = async (m, { args, text, conn, command }) => {
  if (!text.includes('|')) {
    return conn.reply(m.chat, `Formato incorrecto ✋\n\nUsa así:\n/recordatorio 60s | Tu mensaje`, m);
  }

  let [tiempoStr, mensaje] = text.split('|').map(v => v.trim());
  let ms = 0;

  if (tiempoStr.endsWith('s')) ms = parseInt(tiempoStr) * 1000;
  else if (tiempoStr.endsWith('m')) ms = parseInt(tiempoStr) * 60 * 1000;
  else if (tiempoStr.endsWith('h')) ms = parseInt(tiempoStr) * 60 * 60 * 1000;
  else return conn.reply(m.chat, `⛔ Usa un tiempo válido con 's', 'm' o 'h'\nEj: 30s | mensaje`, m);

  if (isNaN(ms) || ms <= 0 || ms > 1000 * 60 * 60 * 12) {
    return conn.reply(m.chat, `❌ El tiempo debe ser entre 1s y 12h máximo`, m);
  }

  // Enviar confirmación por privado
  try {
    await conn.reply(m.sender, `✅ Recordatorio programado en *${tiempoStr}*\n⏳ Esperando para enviarte el mensaje...`, null);

    setTimeout(() => {
      conn.sendMessage(m.sender, {
        text: `🔔 *Recordatorio:*\n${mensaje}`
      });
    }, ms);

  } catch (e) {
    await conn.reply(m.chat, '❌ No pude mandarte el recordatorio por privado. ¿Tienes el chat abierto conmigo? 😢', m);
  }
};

handler.help = ['recordatorio <tiempo> | <mensaje>'];
handler.tags = ['canal'];
handler.command = ['recordatorio', 'remindme'];
handler.register = true;
handler.channel = true;

export default handler;
