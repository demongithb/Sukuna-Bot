const categorias = [
  {
    titulo: "¿Cuál eliges? 🔥💧🌱⚡",
    opciones: ["🔥 Fuego", "💧 Agua", "🌱 Planta", "⚡ Rayo"]
  },
  {
    titulo: "¿Qué marca de celular prefieres? 📱",
    opciones: ["Apple 🍎", "Samsung 📱", "Xiaomi 🧧", "Huawei 🛰️"]
  },
  {
    titulo: "¿Comida favorita? 🍔🍕🍣",
    opciones: ["🍔 Hamburguesa", "🍕 Pizza", "🍣 Sushi", "🌮 Tacos"]
  },
  {
    titulo: "¿Tu YouTuber fav? 🎥",
    opciones: ["MrBeast 💸", "Luisito Comunica 🌎", "AuronPlay 😂", "Tu Mismo 🔥"]
  },
  {
    titulo: "¿Qué superhéroe parte más madres? 🦸‍♂️",
    opciones: ["Batman 🦇", "Iron Man 🤖", "Spider-Man 🕷️", "Goku 💥"]
  },
  {
    titulo: "¿Qué prefieres? 😴🍕",
    opciones: ["Dormir 😴", "Comer 🍕", "Amor 💘", "Programar 💻"]
  },
  {
    titulo: "¿Cuál eliges como novia ficticia? 😳",
    opciones: ["Zero Two 💗", "Hinata 💞", "Megumin 💥", "Tu crush imposible 😩"]
  }
];

const handler = async (m, { conn }) => {
  const juego = categorias[Math.floor(Math.random() * categorias.length)];
  const poll = await conn.sendPoll(m.chat, `🎮 *MINIJUEGO:* ${juego.titulo}`, juego.opciones);

  // ⏱️ Esperamos 20 segundos
  setTimeout(async () => {
    const ganador = juego.opciones[Math.floor(Math.random() * juego.opciones.length)];
    await conn.sendMessage(m.chat, {
      text: `🏆 *¡Y el ganador aleatorio es:* ${ganador}!*`,
      mentions: [m.sender]
    });
  }, 20000);
};

handler.help = ['minijuego'];
handler.tags = ['canal'];
handler.command = ['minijuego', 'jueguito'];
handler.register = true;
handler.channel = true;

export default handler;
