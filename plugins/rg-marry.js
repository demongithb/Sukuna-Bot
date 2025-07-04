import fs from 'fs';
import path from 'path';

const marriagesFile = path.resolve('src/database/casados.json');
let proposals = {}; 
let marriages = loadMarriages();
const confirmation = {};

function loadMarriages() {
  return fs.existsSync(marriagesFile) ? JSON.parse(fs.readFileSync(marriagesFile, 'utf8')) : {};
}

function saveMarriages() {
  fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2));
}

const handler = async (m, { conn, command }) => {
  const isPropose = /^marry$/i.test(command);
  const isDivorce = /^divorce$/i.test(command);

  const userIsMarried = (user) => marriages[user] !== undefined;

  try {
    if (isPropose) {
      const proposee = m.quoted?.sender || m.mentionedJid?.[0];
      const proposer = m.sender;

      if (!proposee) {
        if (userIsMarried(proposer)) {
          return await conn.reply(m.chat, `《✧》 Ya estás casado con *${conn.getName(marriages[proposer])}*\n> Puedes divorciarte con el comando: *#divorce*`, m);
        } else {
          throw new Error('Debes mencionar a alguien para proponer matrimonio.\n> Ejemplo » *#marry @usuario*');
        }
      }

      if (userIsMarried(proposer)) throw new Error(`Ya estás casado con ${conn.getName(marriages[proposer])}.`);
      if (userIsMarried(proposee)) throw new Error(`${conn.getName(proposee)} ya está casado con ${conn.getName(marriages[proposee])}.`);
      if (proposer === proposee) throw new Error('¡No puedes proponerte matrimonio a ti mismo!');

      proposals[proposer] = proposee;
      const proposerName = conn.getName(proposer);
      const proposeeName = conn.getName(proposee);
      const confirmationMessage = `♡ ${proposerName} te ha propuesto matrimonio ${proposeeName} ¿aceptas? •(=^●ω●^=)•\n\n*Debes responder con:*\n> ✐ "Sí"\n> ✐ "No"`;

      await conn.reply(m.chat, confirmationMessage, m, { mentions: [proposee, proposer] });

      confirmation[proposee] = {
        proposer,
        timeout: setTimeout(() => {
          conn.sendMessage(m.chat, { text: '*《✧》Se acabó el tiempo, no se obtuvo respuesta. La propuesta fue cancelada.*' }, { quoted: m });
          delete confirmation[proposee];
        }, 60000)
      };

    } else if (isDivorce) {
      if (!userIsMarried(m.sender)) throw new Error('No estás casado con nadie.');

      const partner = marriages[m.sender];
      delete marriages[m.sender];
      delete marriages[partner];
      saveMarriages();

      await conn.reply(m.chat, `✐ ${conn.getName(m.sender)} y ${conn.getName(partner)} se han divorciado.`, m);
    }
  } catch (error) {
    await conn.reply(m.chat, `《✧》 ${error.message}`, m);
  }
};

handler.before = async function (m, { conn }) {
  if (m.isBaileys || !m.text || !(m.sender in confirmation)) return;

  const { proposer, timeout } = confirmation[m.sender];
  const text = m.text?.toLowerCase().trim();

  if (text === 'no') {
    clearTimeout(timeout);
    delete confirmation[m.sender];
    return conn.sendMessage(m.chat, { text: '*《✧》Han rechazado la propuesta de matrimonio.*' }, { quoted: m });
  }

  if (text === 'si' || text === 'sí') {
    delete proposals[proposer];
    marriages[proposer] = m.sender;
    marriages[m.sender] = proposer;
    saveMarriages();

    await conn.sendMessage(m.chat, {
      text: `✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩
¡Se han Casado! 💍💕\n\n💖 Esposo: *${conn.getName(proposer)}*\n💖 Esposa: *${conn.getName(m.sender)}*\n\n¡Disfruten de su luna de miel! ꒰ᐢ⸝⸝⸝ᵕᴗᵕ⸝⸝⸝ᐢ꒱✨
✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩`,
      mentions: [proposer, m.sender]
    }, { quoted: m });

    clearTimeout(timeout);
    delete confirmation[m.sender];
  }
};

handler.tags = ['rg'];
handler.help = ['marry *@usuario*', 'divorce'];
handler.command = ['marry', 'divorce'];
handler.group = true;

export default handler;
