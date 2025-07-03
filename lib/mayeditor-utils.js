// UTILIDADES PARA MAYEDITOR
// CODIGO HECHO POR SOYMAYCOL
// github: SoySapo6

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import ffmpeg from 'fluent-ffmpeg'

const execAsync = promisify(exec)

/**
 * Configuración de videos disponibles
 */
export const VIDEOS_MAP = {
  '1': 'https://github.com/SoySapo6/SoySapo6/raw/refs/heads/main/lv_0_20250628140039.mp4',
  '2': 'https://files.catbox.moe/ma45xv.mp4',
  '3': 'https://files.catbox.moe/jaitl8.mp4',
  '4': 'https://files.catbox.moe/egjief.mp4',
  '5': 'https://files.catbox.moe/ol9nt6.mp4',
  '6': 'https://files.catbox.moe/r4nsbu.mp4',
  '7': 'https://files.catbox.moe/swrnxi.mp4',
  '8': 'https://files.catbox.moe/tv6atn.mp4',
  '9': 'https://files.catbox.moe/hmpoim.mp4',
  '10': 'https://files.catbox.moe/mpoioh.mp4'
}

/**
 * Configuración del sistema
 */
export const CONFIG = {
  DAILY_LIMIT: 15,
  TEMP_DIR: './temp',
  CLEANUP_DELAY: 15000,
  PROGRESS_UPDATE_THRESHOLD: 5,
  PROGRESS_UPDATE_DELAY: 500
}

/**
 * Descargar video usando curl
 * @param {string} url - URL del video a descargar
 * @param {string} outputPath - Ruta donde guardar el video
 * @returns {Promise<boolean>}
 */
export const downloadVideoWithCurl = async (url, outputPath) => {
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

/**
 * Crear directorio temporal si no existe
 */
export const ensureTempDir = () => {
  if (!fs.existsSync(CONFIG.TEMP_DIR)) {
    fs.mkdirSync(CONFIG.TEMP_DIR, { recursive: true })
  }
}

/**
 * Obtener información del video usando ffprobe
 * @param {string} videoPath - Ruta del video
 * @returns {Promise<Object>}
 */
export const getVideoInfo = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err)
      else resolve(metadata)
    })
  })
}

/**
 * Crear barra de progreso visual
 * @param {number} percent - Porcentaje de progreso (0-100)
 * @returns {string}
 */
export const createProgressBar = (percent) => {
  const totalBars = 10
  const filledBars = Math.floor((percent / 100) * totalBars)
  const emptyBars = totalBars - filledBars
  return '▰'.repeat(filledBars) + '▱'.repeat(emptyBars)
}

/**
 * Limpiar archivos temporales
 * @param {Array<string>} filePaths - Array de rutas de archivos a eliminar
 */
export const cleanupFiles = (filePaths) => {
  setTimeout(() => {
    try {
      filePaths.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log(`🗑️ Eliminado: ${path.basename(filePath)}`)
        }
      })
      console.log('✅ Archivos temporales limpiados')
    } catch (e) {
      console.error('Error limpiando archivos temporales:', e)
    }
  }, CONFIG.CLEANUP_DELAY)
}

/**
 * Limpiar archivos de emergencia (para casos de error)
 * @param {string} targetUserId - ID del usuario para generar nombres de archivos
 */
export const emergencyCleanup = (targetUserId) => {
  try {
    const filesToClean = [
      path.join(CONFIG.TEMP_DIR, `profile_${targetUserId}.jpg`),
      path.join(CONFIG.TEMP_DIR, `input_${targetUserId}_${Date.now()}.mp4`),
      path.join(CONFIG.TEMP_DIR, `output_${targetUserId}_${Date.now()}.mp4`)
    ]
    
    filesToClean.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    })
  } catch (e) {
    console.error('Error en limpieza de emergencia:', e)
  }
}

/**
 * Crear mensaje de contacto falso para el video
 * @param {string} targetUserId - ID del usuario
 * @returns {Object}
 */
export const createFakeContact = (targetUserId) => {
  return {
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
}

/**
 * Generar mensaje final del video procesado
 * @param {string} type - Tipo de video (1-10)
 * @param {string} targetUserId - ID del usuario
 * @param {number} videoWidth - Ancho del video
 * @param {number} videoHeight - Alto del video
 * @param {number} usesLeft - Usos restantes del día
 * @returns {string}
 */
export const createMagicMessage = (type, targetUserId, videoWidth, videoHeight, usesLeft) => {
  return `
✧･ﾟ: ✧･ﾟ: 𝑀𝒶𝑔𝒾𝒸 𝒱𝒾𝒹𝑒𝑜 :･ﾟ✧:･ﾟ✧
𓂃𓈒𓏸 Video mágico tipo ${type} creado para @${targetUserId}
✦ Procesado con tecnología sobrenatural
✧ Tu esencia ha sido capturada en este hechizo visual
✧ Resolución adaptada: ${videoWidth}x${videoHeight}
✧ Usos restantes hoy: ${usesLeft}/${CONFIG.DAILY_LIMIT}
𓆩𓆪 ━━━━━━━━━━━━━━━━
  `.trim()
}

/**
 * Obtener mensaje de error específico según el tipo
 * @param {Error} error - Error ocurrido
 * @returns {string}
 */
export const getErrorMessage = (error) => {
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
  
  return errorMessage
  }
