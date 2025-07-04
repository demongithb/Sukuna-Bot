import { io } from "socket.io-client";

let socket = null;

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (command === 'mayhost') {
    if (args.length < 2) return m.reply(`*Uso:* ${usedPrefix + command} <url> <token>`);

    if (socket?.connected) {
      return m.reply('⚠️ Ya estás conectado, usa *.mayhostcmd <comando>* o *.mayhostcmd exit*.');
    }

    const url = args[0];
    const token = args[1];

    m.reply(`🔄 *Conectando a MayHost...*\n🌐 URL: ${url}\n🔑 Token: ${token}`);

    socket = io(url, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socket.on('connect', () => {
      m.reply(`✅ *Conectado a MayHost!* 🎉\nEnvía comandos con *.mayhostcmd <comando>*`);
    });

    socket.on('disconnect', reason => {
      m.reply(`❌ *Desconectado:* ${reason}`);
      socket = null;
    });

    socket.on('connect_error', error => {
      m.reply(`❌ *Error de conexión:* ${error.message}`);
      socket = null;
    });

    socket.on('output', data => {
      if (data?.trim()) {
        m.reply(`${data}`);
      }
    });

    socket.on('session', data => {
      m.reply(`📋 *Sesión activa:* ${data.username} (${data.sessionId})`);
    });

    socket.on('reconnect', attempt => {
      m.reply(`✅ *Reconectado después de ${attempt} intentos*`);
    });

    socket.on('reconnect_failed', () => {
      m.reply('❌ *No se pudo reconectar al servidor*');
      socket = null;
    });

  } else if (command === 'mayhostcmd') {
    if (!socket?.connected) return m.reply('❌ No hay sesión activa, conecta con *.mayhost <url> <token>* primero.');
    if (!args.length) return m.reply(`*Uso:* ${usedPrefix + command} <comando>`);

    const cmd = args.join(' ');

    if (cmd.toLowerCase() === 'exit') {
      socket.disconnect();
      socket = null;
      return m.reply('👋 Sesión cerrada.');
    }

    socket.emit('command', cmd);
  }
};

handler.help = ['mayhost <url> <token>', 'mayhostcmd <comando>'];
handler.tags = ['tools'];
handler.command = ['mayhost', 'mayhostcmd'];

export default handler;
