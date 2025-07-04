import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type';

let handler = async (m, { conn }) => {
  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime) {
    return conn.reply(m.chat, '🪄 Responde a un archivo válido, darling~ ✨ (imagen, video o HTML)', m);
  }

  await m.react('⏳');

  try {
    let media = await q.download();
    const result = await uploadToMayCloud(media);

    let msg = `*❀ MAYCLOUD - Uploader ❀*\n\n`;
    msg += `🌐 *Enlace*: ${result.url}\n`;
    msg += `📁 *Archivo*: ${result.filename}\n`;
    msg += `🧠 *Tamaño*: ${formatBytes(result.size)}\n`;
    msg += `🌸 *Tipo*: ${result.mimetype}\n\n`;
    msg += `╰(*´︶\`*)╯♡  *Subido con amor por ${personaje}~*`;

    await conn.sendFile(m.chat, media, result.filename, msg, m);
    await m.react('✅');
  } catch (err) {
    console.error(err);
    await m.react('❌');
    await conn.reply(m.chat, '💔 No pude subirlo... ¿Me perdonas? (｡•́︿•̀｡)', m);
  }
};

handler.help = ['maycloud'];
handler.tags = ['uploader'];
handler.command = ['maycloud', 'tomaycloud'];
handler.mamtenimiento = true

export default handler;

// ────────────── Utils kawaii ✨ ──────────────

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function uploadToMayCloud(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || { ext: 'html', mime: 'text/html' };
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const form = new FormData();
  form.set('file', blob, `hanako_${Date.now()}.${ext}`);

  const res = await fetch('https://maycloud.onrender.com/upload', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) throw new Error(`Error al subir a MayCloud: ${res.statusText}`);
  return await res.json();
}
