// CODIGO HECHO POR SOYMAYCOL
// DEJAR CREDITOS AL CREADOR UWU
// github: SoySapo6

import { 
  VIDEOS_MAP, 
  createFakeContact, 
  createMagicMessage, 
  getErrorMessage 
} from '../lib/mayeditor-utils.js'
import { 
  checkAndUpdateLimit, 
  revertUsageCount 
} from '../lib/mayeditor-rate-limiter.js'
import { 
  createProgressManager 
} from '../lib/mayeditor-progress.js'
import { 
  processVideo 
} from '../lib/mayeditor-processor.js'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  // Validar parámetros
  let type = args[0]?.toLowerCase()
  if (!type || !Object.keys(VIDEOS_MAP).includes(type)) {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1\nExiste del 1 al 10`)
  }

  const userId = m.sender

  // Verificar límite de uso
  const limitCheck = checkAndUpdateLimit(userId)
  if (!limitCheck.allowed) {
    return m.reply('✧ Ya has usado tu magia 15 veces hoy, espíritu.\n✧ Vuelve mañana para más hechizos visuales... 🌙')
  }

  try {
    // Crear sistema de progreso
    const { updateProgress } = await createProgressManager(
      conn, 
      m, 
      type, 
      limitCheck.count
    )

    // Obtener foto de perfil
    const profilePictureUrl = await conn.profilePictureUrl(userId, 'image').catch(_ =>
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg'
    )

    const profileResponse = await fetch(profilePictureUrl)
    const profileBuffer = await profileResponse.buffer()

    // Procesar video
    const { video: processedVideo, dimensions } = await processVideo({
      userId,
      videoUrl: VIDEOS_MAP[type],
      profileBuffer,
      updateProgress
    })

    // Crear mensaje y contacto falso
    const targetUserId = userId.split('@')[0]
    const fakeContact = createFakeContact(targetUserId)
    const magicMessage = createMagicMessage(
      type,
      targetUserId,
      dimensions.width,
      dimensions.height,
      limitCheck.remaining
    )

    // Enviar video procesado
    await conn.sendMessage(m.chat, {
      video: processedVideo,
      caption: magicMessage,
      mentions: [userId],
      mimetype: 'video/mp4'
    }, { quoted: fakeContact })

  } catch (error) {
    console.error('Error procesando video:', error)

    // Revertir contador de uso
    revertUsageCount(userId)

    // Enviar mensaje de error específico
    const errorMessage = getErrorMessage(error)
    m.reply(errorMessage)
  }
}

handler.help = ['mayeditor <1|2|3|4|5|6|7|8|9|10>']
handler.tags = ['group', 'fun', 'media']
handler.command = ['mayeditor']
handler.limit = true

export default handler