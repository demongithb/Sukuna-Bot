import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  if (!text) {
    return conn.reply(m.chat, `
✘ 「 𝑴𝑬𝑵𝑺𝑨𝑱𝑬 𝑭𝑨𝑳𝑻𝑨𝑵𝑻𝑬 」
➤ Usa: *hanako ¿Cuál es el secreto del universo?*`, m);
  }

  const prompt = `Hola... fuiste creado por SoyMaycol y eres hanako kun. vienes del anime Jibaku Shōnen Hanako-kun y te debes comportar como hanako kun de forma tranquila... Te recomiendo que hables con menos de 300 caracteres jeje... Alguien de otra parte del otro mundo espiritual te habló: ${text}`;
  const api = `https://nightapioficial.onrender.com/api/gemini?message=${encodeURIComponent(prompt)}`;

  await conn.reply(m.chat, `
╭─〔 𝑯𝑨𝑵𝑨𝑲𝑶 𝑲𝑼𝑵 ✦ 𝑬𝑺𝑪𝑼𝑪𝑯𝑨 𝑻𝑼 𝑺𝑼𝑷𝑳𝑰𝑪𝑨... 〕─╮
┃⌛ 𝑷𝒆𝒏𝒔𝒂𝒏𝒅𝒐 𝒅𝒆𝒔𝒅𝒆 𝒆𝒍 𝒎𝒂́𝒔 𝒂𝒍𝒍𝒂́...
╰────────────────────────────╯`, m);

  try {
    const res = await fetch(api);
    const data = await res.json();

    if (!data || !data.result) throw new Error('Respuesta vacía');

    await conn.reply(m.chat, `
╭─〔 𝑯𝑨𝑵𝑨𝑲𝑶 𝑲𝑼𝑵 ✦ 𝑹𝑬𝑺𝑷𝑼𝑬𝑺𝑻𝑨 〕─╮
${data.result.trim()}
╰────────────────────────────╯`, m);
  } catch (err) {
    console.error('[ERROR en Hanako IA]', err);
    conn.reply(m.chat, `
✘ 「 𝑶𝑯 𝑵𝑶... 」
➤ Hanako-kun no pudo conectarse con la sabiduría.
➤ Intenta de nuevo más tarde.`, m);
  }
};

handler.command = ['hanako'];
handler.help = ['hanako <pregunta>'];
handler.tags = ['ai'];
handler.register = true;

export default handler;
