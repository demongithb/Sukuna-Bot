const handler = async (m, {conn, args}) => {
  if (!args[0]) throw 'Escribe la nueva descripción.';

  const firma = `\n\n> ${global.textbot}`;
  const nuevaDescripcion = `${args.join(' ')}${firma}`;

  await conn.groupUpdateDescription(m.chat, nuevaDescripcion);

  const textoRespuesta = `🇯🇵 ${global.personaje} 🇯🇵\n\nHola querido usuario ^^,\nHe cambiado la descripción a:\n\n${nuevaDescripcion}\n\nEspero disfrutes de esta nueva descripción jeje ^^`;

  await conn.sendMessage(m.chat, {
    text: textoRespuesta,
    contextInfo: {
      externalAdReply: {
        title: 'Descripción actualizada',
        body: global.textbot,
        thumbnailUrl: global.banner, // Cambia esto por tu imagen
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true,
        sourceUrl: global.canalLink
      }
    }
  }, { quoted: m });
};

handler.help = ['groupdesc <texto>'];
handler.tags = ['grupo'];
handler.command = ['gpdesc', 'groupdesc'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
