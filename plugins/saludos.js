const handler = async (m, { conn }) => {
  const texto = m.text || '';

  if (/saludoespecial/i.test(texto)) {
    const saludoPersonalizado = `
¡Un saludo súper especial para:! (≧◡≦)
\n✨ Persona 1: Sofia ✨\n✨ Persona 2: Angel ✨\n✨ Persona 3: Dayana ✨\n✨ Persona 4: Genesis ✨\n✨ Persona 5: Abram Insano ✨
\nQue tengan un día lleno de alegría y código genial! ♡`;

    await conn.reply(m.chat, saludoPersonalizado, m);
  }
};

handler.help = ['saludoespecial'];
handler.tags = ['fun'];
handler.command = ['saludoespecial']; // Aca MayCode es para cuando alguien diga saludoespecial el Bot responda
handler.register = true;

export default handler;
