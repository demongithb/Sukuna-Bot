// SISTEMA DE PROGRESO PARA MAYEDITOR
// CODIGO HECHO POR SOYMAYCOL
// github: SoySapo6

import { CONFIG, createProgressBar } from './mayeditor-utils.js'

/**
 * Crear y gestionar el sistema de progreso
 * @param {Object} conn - Conexión de WhatsApp
 * @param {Object} m - Mensaje original
 * @param {string} type - Tipo de video
 * @param {number} currentCount - Uso actual del día
 * @returns {Object} - { updateProgress: Function, initialMessage: Object }
 */
export const createProgressManager = async (conn, m, type, currentCount) => {
  // Mensaje inicial
  const initialMessage = await m.reply(
    `🎬 Procesando tu video mágico tipo ${type}... (${currentCount}/${CONFIG.DAILY_LIMIT} usos hoy)\n✧ Esto tomará unos momentos...\n\n▱▱▱▱▱▱▱▱▱▱ 0%\n\n> Hecho por SoyMaycol`
  )

  let lastProgressSent = -1

  /**
   * Actualizar el progreso del procesamiento
   * @param {number} percent - Porcentaje de progreso (0-100)
   */
  const updateProgress = async (percent) => {
    const roundedPercent = Math.round(percent)
    
    // Solo actualizar si hay un cambio significativo
    if (roundedPercent - lastProgressSent < CONFIG.PROGRESS_UPDATE_THRESHOLD && roundedPercent < 100) {
      return
    }
    
    const progressBar = createProgressBar(percent)
    const progressMessage = `🎬 Procesando tu video mágico tipo ${type}... (${currentCount}/${CONFIG.DAILY_LIMIT} usos hoy)\n✧ Esto tomará unos momentos...\n\n${progressBar} ${roundedPercent}%\n\n> Hecho por SoyMaycol`
    
    try {
      await conn.sendMessage(m.chat, { 
        text: progressMessage, 
        edit: initialMessage.key 
      })
      lastProgressSent = roundedPercent
      
      // Pausa para evitar spam de actualizaciones
      await new Promise(resolve => setTimeout(resolve, CONFIG.PROGRESS_UPDATE_DELAY))
    } catch (e) {
      console.log('Error actualizando progreso:', e)
    }
  }

  return {
    updateProgress,
    initialMessage
  }
}

/**
 * Etapas de progreso predefinidas
 */
export const PROGRESS_STAGES = {
  PREPARATION: 5,
  DOWNLOAD: 15,
  ANALYSIS: 25,
  PROCESSING_START: 30,
  PROCESSING_END: 95,
  COMPLETE: 100
}
