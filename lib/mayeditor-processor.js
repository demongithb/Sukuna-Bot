// PROCESADOR DE VIDEO PARA MAYEDITOR
// CODIGO HECHO POR SOYMAYCOL
// github: SoySapo6

import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { 
  downloadVideoWithCurl, 
  ensureTempDir, 
  getVideoInfo, 
  CONFIG 
} from './mayeditor-utils.js'

/**
 * Procesar video aplicando chroma key con foto de perfil
 * @param {Object} params - Parámetros de procesamiento
 * @returns {Promise<Buffer>} - Video procesado
 */
export const processVideo = async ({
  userId,
  videoUrl,
  profileBuffer,
  updateProgress
}) => {
  const targetUserId = userId.split('@')[0]
  
  // Asegurar que existe el directorio temporal
  ensureTempDir()
  
  // Generar rutas de archivos únicos
  const timestamp = Date.now()
  const profilePath = path.join(CONFIG.TEMP_DIR, `profile_${targetUserId}_${timestamp}.jpg`)
  const inputVideoPath = path.join(CONFIG.TEMP_DIR, `input_${targetUserId}_${timestamp}.mp4`)
  const outputVideoPath = path.join(CONFIG.TEMP_DIR, `output_${targetUserId}_${timestamp}.mp4`)
  
  try {
    // Guardar imagen de perfil
    fs.writeFileSync(profilePath, profileBuffer)
    await updateProgress(5) // Preparación completada
    
    // Descargar video usando curl
    console.log(`Descargando video desde: ${videoUrl}`)
    await downloadVideoWithCurl(videoUrl, inputVideoPath)
    await updateProgress(15) // Descarga completada
    
    // Obtener información del video
    const videoInfo = await getVideoInfo(inputVideoPath)
    const videoStream = videoInfo.streams.find(s => s.codec_type === 'video')
    const videoWidth = videoStream.width
    const videoHeight = videoStream.height
    
    console.log(`Video dimensions: ${videoWidth}x${videoHeight}`)
    await updateProgress(25) // Análisis completado
    
    // Procesar video con FFmpeg
    await processVideoWithFFmpeg({
      inputVideoPath,
      profilePath,
      outputVideoPath,
      videoWidth,
      videoHeight,
      videoStream,
      updateProgress
    })
    
    // Leer video procesado
    const processedVideo = fs.readFileSync(outputVideoPath)
    
    // Limpiar archivos temporales
    setTimeout(() => {
      [profilePath, inputVideoPath, outputVideoPath].forEach(filePath => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      })
    }, CONFIG.CLEANUP_DELAY)
    
    return {
      video: processedVideo,
      dimensions: { width: videoWidth, height: videoHeight }
    }
    
  } catch (error) {
    // Limpiar archivos en caso de error
    [profilePath, inputVideoPath, outputVideoPath].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    })
    throw error
  }
}

/**
 * Procesar video usando FFmpeg con configuración optimizada
 */
const processVideoWithFFmpeg = ({
  inputVideoPath,
  profilePath,
  outputVideoPath,
  videoWidth,
  videoHeight,
  videoStream,
  updateProgress
}) => {
  return new Promise((resolve, reject) => {
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
        '-r', `${videoStream.r_frame_rate || '30'}`,
        '-f', 'mp4'
      ])
      .output(outputVideoPath)
      .on('start', (cmd) => console.log('FFmpeg started:', cmd))
      .on('progress', async (progress) => {
        if (progress.percent) {
          // Actualizar barra de progreso solo en intervalos significativos
          const adjustedPercent = Math.min(25 + (progress.percent * 0.7), 95)
          
          // Solo actualizar cada 10% para evitar spam
          if (Math.round(adjustedPercent) % 10 === 0 || adjustedPercent >= 95) {
            await updateProgress(adjustedPercent)
          }
          
          if (Math.round(progress.percent) % 20 === 0) {
            console.log(`Processing... ${Math.round(progress.percent)}%`)
          }
        }
      })
      .on('end', async () => {
        console.log('✅ Processing finished')
        await updateProgress(100)
        
        // Verificar que el archivo se generó correctamente
        if (!fs.existsSync(outputVideoPath)) {
          reject(new Error('El archivo de video procesado no se generó correctamente'))
          return
        }
        
        const fileStats = fs.statSync(outputVideoPath)
        if (fileStats.size === 0) {
          reject(new Error('El archivo de video procesado está vacío'))
          return
        }
        
        resolve()
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err.message)
        reject(new Error(`FFmpeg processing failed: ${err.message}`))
      })
      .run()
  })
}
