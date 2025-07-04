// Para almacenar stats (simple, en memoria, podrías usar DB luego)
let mensajesHoy = 0;
let ultimaEncuesta = 'Ninguna';

const handlerEstado = async (m, { conn }) => {
  // Contar participantes en el chat
  const participantes = await conn.groupMetadata(m.chat)
    .then(metadata => metadata.participants.length)
    .catch(() => 0);

  // Mensajes hoy: aquí solo usamos contador en memoria (reinicia al reiniciar el bot)
  // Puedes mejorar guardando en DB o JSON

  const texto = `
📊 *ESTADO DEL CANAL* 📊

👥 Participantes: ${participantes}
💬 Mensajes enviados (desde que el bot está ON): ${mensajesHoy}
🗳 Última encuesta: ${ultimaEncuesta}

(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ ¡Sigue participando y pasándola bien!
`;

  await conn.reply(m.chat, texto, m);
};

// Este middleware suma mensajes para el conteo (lo tienes que conectar en tu sistema)
const contarMensajes = (m) => {
  mensajesHoy++;
  return m;
};

// Para actualizar la última encuesta, en tu función de encuesta haz:
// ultimaEncuesta = "Minijuego fuego vs agua" (o lo que sea)

handlerEstado.help = ['estadodelcanal'];
handlerEstado.tags = ['canal'];
handlerEstado.command = ['estadodelcanal'];
handlerEstado.register = true;
handlerEstado.channel = true;

export { handlerEstado, contarMensajes };
