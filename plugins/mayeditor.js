// DEJAR CREDITOS AL CREADOR UWU
// github: SoySapo6

import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix }) => {
 // if (!m.isGroup) return m.reply('👻 Este comando solo funciona en grupos, espíritu.')

  // Aquí leemos el número que ponen después de mayeditor
  let type = args[0]?.toLowerCase()
  if (!type || !['1','2','3','4','5', '6', '7', '8', '9', '10'].includes(type)) {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1\nExiste del 1 al 10`)
  }

  // Map de videos según el número que pongan
  const videosMap = {
    '1': './videos/lv_7507655713968164149_20250607160908.mp4',
    '2': './videos/lv_7463895997605743933_20250607164555.mp4',
    '3': './videos/lv_7404392617884028176_20250607165541.mp4',
    '4': './videos/lv_7403812168765852946_20250607173804.mp4',
    '5': './videos/lv_7495448057157340469_20250607164932.mp4',
    '6': './videos/lv_7497686403254373693_20250607170616.mp4',
    '7': './videos/lv_7507655713968164149_20250607160908.mp4',
    '8': './videos/lv_7478259089345187125_20250608202445.mp4',
    '9': './videos/lv_7504712502689746229_20250608202734.mp4',
    '10': './videos/lv_7307348459189800197_20250609084922.mp4'
  }

  // Elegimos la ruta del video según el número
  const inputVideoPath = videosMap[type]

  // Rate limiting: 10 veces al día por usuario
  const userId = m.sender
  const today = new Date().toDateString()

  if (!global.db.data.users[userId]) {
    global.db.data.users[userId] = {}
  }

  if (!global.db.data.users[userId].mayeditor) {
    global.db.data.users[userId].mayeditor = { count: 0, date: today }
  }

  const userLimit = global.db.data.users[userId].mayeditor

  if (userLimit.date !== today) {
    userLimit.count = 0
    userLimit.date = today
  }

  if (userLimit.count >= 15) {
    return m.reply('✧ Ya has usado tu magia 15 veces hoy, espíritu.\n✧ Vuelve mañana para más hechizos visuales... 🌙')
  }

  userLimit.count++

  const targetUserId = userId.split('@')[0]

  try {
    // Mensaje inicial con barra de progreso
    const initialMessage = await m.reply(`🎬 Procesando tu video mágico tipo ${type}... (${userLimit.count}/10 usos hoy)\n✧ Esto tomará unos momentos...\n\n▱▱▱▱▱▱▱▱▱▱ 0%\n\n> Hecho por SoyMaycol`)

    // Función para actualizar la barra de progreso
    const updateProgress = async (percent) => {
      const totalBars = 10
      const filledBars = Math.floor((percent / 100) * totalBars)
      const emptyBars = totalBars - filledBars
      const progressBar = '▰'.repeat(filledBars) + '▱'.repeat(emptyBars)

      const progressMessage = `🎬 Procesando tu video mágico tipo ${type}... (${userLimit.count}/10 usos hoy)\n✧ Esto tomará unos momentos...\n\n${progressBar} ${Math.round(percent)}%\n\n> Hecho por SoyMaycol`

      try {
        await conn.sendMessage(m.chat, { text: progressMessage, edit: initialMessage.key })
      } catch (e) {
        console.log('Error actualizando progreso:', e)
      }
    }

    const pp = await conn.profilePictureUrl(userId, 'image').catch(_ =>    
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')    

    const profileResponse = await fetch(pp)    
    const profileBuffer = await profileResponse.buffer()    

    const tempDir = './temp'    
    if (!fs.existsSync(tempDir)) {    
      fs.mkdirSync(tempDir, { recursive: true })    
    }    

    const profilePath = path.join(tempDir, `profile_${targetUserId}.jpg`)    
    const outputVideoPath = path.join(tempDir, `output_${targetUserId}_${Date.now()}.mp4`)    

    if (!fs.existsSync(inputVideoPath)) {    
      return m.reply('❌ No se encontró el video base. Verifica la ruta del archivo.')    
    }    

    fs.writeFileSync(profilePath, profileBuffer)    

    // Actualizar progreso: preparación completada
    await updateProgress(15)

    // Primero obtenemos las dimensiones del video
    const videoInfo = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
        if (err) reject(err)
        else resolve(metadata)
      })
    })

    const videoStream = videoInfo.streams.find(s => s.codec_type === 'video')
    const videoWidth = videoStream.width
    const videoHeight = videoStream.height

    console.log(`Video dimensions: ${videoWidth}x${videoHeight}`)

    // Actualizar progreso: análisis completado
    await updateProgress(25)

    await new Promise((resolve, reject) => {    
      ffmpeg(inputVideoPath)    
        .input(profilePath)    
        .complexFilter([    
          // Aplicar chroma key al video manteniendo el color morado 0xba00ff
          '[0:v]colorkey=0xba00ff:0.3:0.2[ckout]',
          // Escalar la imagen de perfil exactamente a las dimensiones del video
          `[1:v]scale=${videoWidth}:${videoHeight}:force_original_aspect_ratio=decrease,pad=${videoWidth}:${videoHeight}:(ow-iw)/2:(oh-ih)/2:black[scaled_profile]`,
          // Superponer la imagen escalada donde estaba el chroma key
          '[scaled_profile][ckout]overlay=0:0:format=auto[final]'
        ])    
        .outputOptions([    
          '-map', '[final]',    
          '-map', '0:a?',    
          '-c:v', 'libx264',    
          '-b:v', '2000k',    
          '-c:a', 'aac',    
          '-b:a', '128k',    
          '-ar', '44100',    
          '-pix_fmt', 'yuv420p',    
          '-movflags', '+faststart',    
          '-preset', 'medium',    
          '-crf', '20',    
          '-maxrate', '3000k',    
          '-bufsize', '4000k',    
          // Mantener la tasa de frames original del video
          '-r', `${videoStream.r_frame_rate || '30'}`,
          '-f', 'mp4'    
        ])    
        .output(outputVideoPath)    
        .on('start', (cmd) => console.log('FFmpeg started:', cmd))    
        .on('progress', async (progress) => {    
          if (progress.percent) {    
            // Actualizar barra de progreso en tiempo real
            const adjustedPercent = Math.min(25 + (progress.percent * 0.7), 95)
            await updateProgress(adjustedPercent)

            if (Math.round(progress.percent) % 20 === 0) {    
              console.log(`Processing... ${Math.round(progress.percent)}%`)    
            }    
          }    
        })    
        .on('end', async () => {    
          console.log('✅ Processing finished')
          await updateProgress(100)
          resolve()    
        })    
        .on('error', (err) => {    
          console.error('❌ FFmpeg error:', err.message)    
          reject(new Error(`FFmpeg processing failed: ${err.message}`))    
        })    
        .run()    
    })    

    // Verificar que el archivo de salida existe y tiene contenido
    if (!fs.existsSync(outputVideoPath)) {
      throw new Error('El archivo de video procesado no se generó correctamente')
    }

    const fileStats = fs.statSync(outputVideoPath)
    if (fileStats.size === 0) {
      throw new Error('El archivo de video procesado está vacío')
    }

    const processedVideo = fs.readFileSync(outputVideoPath)    

    const fkontak = {    
      key: {    
        participants: '0@s.whatsapp.net',    
        remoteJid: 'status@broadcast',    
        fromMe: false,    
        id: 'MayEditor-Magic'    
      },    
      message: {    
        contactMessage: {    
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:MayEditor;Magic;;;\nFN:MayEditor Magic\nitem1.TEL;waid=${targetUserId}:${targetUserId}\nitem1.X-ABLabel:Magia\nEND:VCARD`    
        }    
      },    
      participant: '0@s.whatsapp.net'    
    }    

    const magicMessage = `
✧･ﾟ: ✧･ﾟ: 𝑀𝒶𝑔𝒾𝒸 𝒱𝒾𝒹𝑒𝑜 :･ﾟ✧:･ﾟ✧
𓂃𓈒𓏸 Video mágico tipo ${type} creado para @${targetUserId}
✦ Procesado con tecnología sobrenatural
✧ Tu esencia ha sido capturada en este hechizo visual
✧ Resolución adaptada: ${videoWidth}x${videoHeight}
✧ Usos restantes hoy: ${15 - userLimit.count}/15
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()

    await conn.sendMessage(m.chat, {    
      video: processedVideo,    
      caption: magicMessage,    
      mentions: [userId],    
      mimetype: 'video/mp4'    
    }, { quoted: fkontak })    

    // Limpieza de archivos temporales después de enviar
    setTimeout(() => {    
      try {    
        if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)    
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)    
        console.log('✅ Archivos temporales limpiados')
      } catch (e) {    
        console.error('Error limpiando archivos temporales:', e)    
      }    
    }, 15000) // Aumentado el tiempo para asegurar que el video se envíe

  } catch (error) {
    console.error('Error procesando video:', error)

    // Revertir el contador solo si hubo un error real
    if (userLimit.count > 0) {
      userLimit.count--
    }

    // Mensaje de error más específico
    let errorMessage = '❌ Ocurrió un error al procesar tu video mágico.'

    if (error.message.includes('FFmpeg')) {
      errorMessage += '\n🔧 Error de procesamiento de video. Verifica que el archivo base exista.'
    } else if (error.message.includes('fetch')) {
      errorMessage += '\n📸 Error al obtener tu foto de perfil. Inténtalo de nuevo.'
    } else {
      errorMessage += '\n⚠️ Error interno. Inténtalo de nuevo más tarde.'
    }

    m.reply(errorMessage)

    // Limpieza de emergencia
    try {    
      const profilePath = path.join('./temp', `profile_${targetUserId}.jpg`)
      const outputVideoPath = path.join('./temp', `output_${targetUserId}_${Date.now()}.mp4`)

      if (fs.existsSync(profilePath)) {    
        fs.unlinkSync(profilePath)    
      }
      if (fs.existsSync(outputVideoPath)) {
        fs.unlinkSync(outputVideoPath)
      }
    } catch (e) {    
      console.error('Error en limpieza de emergencia:', e)    
    }
  }
}

handler.help = ['mayeditor <1|2|3|4|5|6|7|8|9|10>']
handler.tags = ['group', 'fun', 'media']
handler.command = ['mayeditor']
handler.limit = true

export default handler