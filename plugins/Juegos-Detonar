let handler = async (m, { conn }) => {
  let resultado = Math.random() < 0.5;
  let mensajes = [
    '💣... *Activando bomba*...',
    '⏳ *Esperando detonación*...',
    '☠️ *Verificando estado*...'
  ];
  let final = resultado
    ? '💥 ¡*BOOM!* Explotaste como palomita.'
    : '✅ *Te salvaste*, la bomba era falsa.';

  for (let msg of mensajes) {
    await conn.reply(m.chat, msg, m);
    await new Promise(res => setTimeout(res, 1000));
  }

  conn.reply(m.chat, final, m);
};
handler.command = /^detonar$/i;
handler.help = ['detonar'];
handler.tags = ['juegos'];
export default handler;