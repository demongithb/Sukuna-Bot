// CODIGO HECHO POR SOYMAYCOL
// DEJAR CREDITOS AL CREADOR UWU
// github: SoySapo6

import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(e

let handler = async (m, { co args, command, usedPrefix }) => {
 // if (!m.isGroup) return m.reply('👻 Este comando solo funciona en grupos, espíritu
  // Aquí leemos el número que ponen después de mayeditor
  let type = args[0]?.toLowerCase()
  if (!e || !['1','2','3','4','5', '6', '7', '8', '9', '10'].includes(type)) {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1\nExiste del 1 al 10`)
  }

  // Map de videos según el número que pongan (ahora con URLs)
  const videosMap = {
    '1': 'https://files.catbox.moe/3c2dvn.mp4',
    '2': 'https://files.catbox.moe/ma45xv.mp4',
    '3': 'https://files.catbox.moe/jaitl8.mp4',
    '4': 'https://files.catbox.moe/egjief.mp4',
    '5': 'https://files.catbox.moe/ol9nt6.mp4',
    '6': 'https://files.catbox.moe/mpoioh.mp4',
    '7': 'https://files.catbox.moe/swrnxi.mp4',
    '8': 'https://files.catbox.moe/tv6atn.mp4',
    '9': 'https://files.catbox.moe/hmpoim.mp4',
    '10': 'https://files.catbox.moe/mpoioh.mp4'
  }

  // Función para descargar video usando curl
  const downloadVideoWithCurl = async (url, outputPath) => {
    try {
      const curlCommand = `curl -L "${url}" -o "${outputPath}"`
      console.log(`Ejecutando: ${curlCommand}`)
      
      const { stdout, stderr } = await execAsync(curlCommand)
      
      if (stderr && stderr.includes('error')) {
        throw new Error(`Error en curl: ${stderr}`)
      }
      
      // Verificar que el archivo se descargó correctamente
      if (!fs.existsSync(outputPath)) {
        throw new Error('El archivo no se descargó correctamente')
      }
      
      const stats = fs.statSync(outputPath)
      if (stats.size === 0) {
        throw new Error('El archivo descargado está vacío')
      }
      
      console.log(`✅ Video descargado exitosamente: ${stats.size} bytes`)
      return true
      
    } catch (error) {
      console.error('Error descargando con curl:', error)
      // Limpiar archivo parcial si existe
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath)
      }
      throw error
    }
  }

  // Elegimos la URL del video según el número
  const inputVideoUrl = videosMap[type]

  // Rate limiting: 15 veces al día por usuario
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
    const initialMessage = await m.reply(`🎬 Procesando tu video mágico tipo ${type}... (${userLimit.count}/15 usos hoy)\n✧ Esto tomará unos momentos...\n\n▱▱▱▱▱▱▱▱▱▱ 0%\n\n> Hecho por SoyMaycol`)

    // Función para actualizar la barra de progreso
    const updateProgress = async (percent) => {
      const totalBars = 10
      const filledBars = Math.floor((percent / 100) * totalBars)
      const emptyBars = totalBars - filledBars
      const progressBar = '▰'.repeat(filledBars) + '▱'.repeat(emptyBars)
      
      const progressMessage = `🎬 Procesando tu video mágico tipo ${type}... (${userLimit.count}/15 usos hoy)\n✧ Esto tomará unos momentos...\n\n${progressBar} ${Math.round(percent)}%\n\n> Hecho por SoyMaycol`
      
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
    const inputVideoPath = path.join(tempDir, `input_${targetUserId}_${Date.now()}.mp4`)
    const outputVideoPath = path.join(tempDir, `output_${targetUserId}_${Date.now()}.mp4`)    
        
    fs.writeFileSync(profilePath, profileBuffer)    

    // Actualizar progreso: preparación completada
    await updateProgress(5)

    // Descargar el video usando curl
    console.log(`Descargando video desde: ${inputVideoUrl}`)
    await downloadVideoWithCurl(inputVideoUrl, inputVideoPath)
    console.log('✅ Video descargado exitosamente con curl')

    // Actualizar progreso: descarga completada
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
        if (fs.existsSync(inputVideoPath)) fs.unlinkSync(inputVideoPath)
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)    
        console.log('✅ Archivos temporales limpiados (incluyendo video descargado con curl)')
      } catch (e) {    
        console.error('Error limpiando archivos temporales:', e)    
      }    
    }, 15000)

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
    } else if (error.message.includes('curl')) {
      errorMessage += '\n🌐 Error al descargar el video con curl. Verifica la conexión o el enlace.'
    } else {
      errorMessage += '\n⚠️ Error interno. Inténtalo de nuevo más tarde.'
    }
    
    m.reply(errorMessage)

    // Limpieza de emergencia
    try {    
      const profilePath = path.join('./temp', `profile_${targetUserId}.jpg`)
      const inputVideoPath = path.join('./temp', `input_${targetUserId}_${Date.now()}.mp4`)
      const outputVideoPath = path.join('./temp', `output_${targetUserId}_${Date.now()}.mp4`)
      
      if (fs.existsSync(profilePath)) {    
        fs.unlinkSync(profilePath)    
      }
      if (fs.existsSync(inputVideoPath)) {    
        fs.unlinkSync(inputVideoPath)    
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
