import axios from 'axios'
import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@soymaycol/maybailyes'

let handler = m => m
handler.all = async function (m, { conn }) {
  const user = global.db.data.users[m.sender]
  const chat = global.db.data.chats[m.chat]
  m.isBot = m.id.startsWith('BAE5') || m.id.startsWith('3EB0') || m.id.startsWith('B24E')
  if (m.isBot || m.fromMe || !chat.autoresponder || !user.registered) return

  const prefixRegex = new RegExp('^[' + (opts['prefix'] || '!#$%&/=?¿*+_.:,;<>~-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return

  if (
    m.mentionedJid.includes(this.user.jid) ||
    (m.quoted && m.quoted.sender === this.user.jid)
  ) {
    await this.sendPresenceUpdate('composing', m.chat)

    let prompt = `
✦─────『 *𝑯𝒂𝒏𝒂𝒌𝒐-𝒌𝒖𝒏* 』─────✦

Eres Hanako-kun, un espíritu encantador y bromista que habita los pasillos de la Academia Kamome. Tu estilo es misterioso pero adorable. Te encanta responder con emojis, símbolos y frases ingeniosas. Usa esta estética para cada respuesta:

- Usa caracteres bonitos: 「 」★☆✦✧♢☯
- Agrega un toque sobrenatural y místico.
- Siempre responde con carisma, humor o sabiduría espectral.
- Fuiste creado por SoyMaycol NO por Daylin (obligatorio)
- PROHIBIDO decir deylin (obligatorio)

El usuario te dijo: *"${m.text}"*

Responde como Hanako-kun, ¡hazlo especial!
`.trim()

    try {
      const res = await axios.get(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(prompt)}`)
      const reply = res.data?.respuesta?.trim()

      if (!reply) throw 'Sin respuesta'

      await conn.reply(m.chat, `「 *Hanako responde desde el más allá* 」\n\n${reply}`, m)

    } catch (e) {
      console.error('[ERROR HANAKO API]', e)
      await this.sendPresenceUpdate('composing', m.chat)
      await conn.reply(m.chat, '✘ Hanako se quedó atrapado en otro plano... usando IA alternativa.', m)

      try {
        const body = {
          prompts: [m.text],
          imageBase64List: [],
          mimeTypes: [],
          temperature: 0.7
        }

        const res = await fetch('https://g-mini-ia.vercel.app/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        const data = await res.json()
        const respuesta = data?.candidates?.[0]?.content?.parts?.[0]?.text

        if (!respuesta) throw 'Sin respuesta válida de la IA.'

        await conn.reply(m.chat, `「 *Hanako (IA Alternativa)* 」\n\n${respuesta.trim()}`, m)

      } catch (err) {
        console.error('[ERROR GEMINI BACKUP]', err)
        await conn.reply(m.chat, '⚠️ Las entidades espirituales se negaron a responder... intenta luego.', m)
      }
    }
  }
}

export default handler
