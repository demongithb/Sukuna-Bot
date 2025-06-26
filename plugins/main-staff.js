let handler = async (m, { conn, command, usedPrefix }) => {
  let img = 'https://files.catbox.moe/cwqdwy.jpg';
  let staff = `╭─❍「 ✦ Staff ✦ 」 
│
├─ ✧ *Dueño:* ᴅᴀʀᴋ ʙʀxᴢᴢᴢ
├─ ✧ *Número:* wa.me/51971285104
├─ ✧ *GitHub:* https://github.com/Jxxlzncom
│
├─ ✦ *Bot:* ${botname}
├─ ⚘ *Versión:* ${vs}
├─ ❖ *Librería:* ${libreria} ${baileys}
│
╰─✦ Que los espíritus te guíen...`;

  await conn.sendFile(m.chat, img, 'hanako-staff.jpg', staff.trim(), fkontak);
};

handler.help = ['staff'];
handler.command = ['colaboradores', 'staff'];
handler.register = true;
handler.tags = ['main'];

export default handler;
