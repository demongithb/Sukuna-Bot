const handler = async (m, { conn }) => {
  try {
    const jid = m.chat;

    // 💡 Detectar si es grupo moderno
    const isModernGroup = jid.endsWith('@lid');

    // ⚠️ Evitar uso de quoted en grupos nuevos
    await conn.sendMessage(jid, {
      text: `
╭─〔 🛠️ 𝑴𝑶𝑫𝑶 𝑷𝑹𝑼𝑬𝑩𝑨 〕─╮
┃👋 ¡Hola! Este grupo es:
┃🔎 ${isModernGroup ? '@lid (moderno)' : '@g.us (clásico)'}
┃✅ Todo funciona correctamente.
╰─────────────────────╯`
    });
  } catch (err) {
    console.error('[ERROR en comando de prueba con lid]', err);
    await conn.reply(m.chat, `
✘ 「 𝑼𝑷𝑺... 𝑬𝑹𝑹𝑶𝑹 」  
➤ Error técnico: ${err.message}`, m);
  }
};

handler.command = ['test'];
handler.help = ['test'];
handler.tags = ['test'];
handler.register = true;

export default handler;
