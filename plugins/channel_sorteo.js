const defaultSorteos = [
  "PlayStation 5",
  "una Casa en Minecraft",
  "una Galleta de Shrek",
  "una Cena con Maycol 😳",
  "un Viaje a la Luna en burbuja",
  "un Server con 1ms de PING 🧠"
];

const handler = async (m, { conn, text }) => {
  const match = m.text.match(/sorteo\s+(.+)/i);
  const premio = match ? match[1].trim() : defaultSorteos[Math.floor(Math.random() * defaultSorteos.length)];

  const pregunta = `🎉 *GENTEEEEE!! SORTEO DEL DÍA* 🎉\n\n📦 Premio: *${premio}*\n\n> Enviado por *MaycolAIUltraMD* 😎✨\n\n¿Quieres participar? 🙌`;

  const opciones = ["¡Sí, obvio! 🤑", "Nop, paso ✌️", "¿Es real esto? 👀", "Solo si hay comida 🍗"];

  await conn.sendPoll(m.chat, pregunta, opciones);
};

handler.help = ['sorteo ps5'];
handler.tags = ['canal'];
handler.command = ['sorteo'];
handler.register = true;
handler.channel = true;

export default handler;
