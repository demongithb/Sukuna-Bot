// SISTEMA DE RATE LIMITING PARA MAYEDITOR
// CODIGO HECHO POR SOYMAYCOL
// github: SoySapo6

import { CONFIG } from './mayeditor-utils.js'

/**
 * Verificar y actualizar el límite de uso diario del usuario
 * @param {string} userId - ID del usuario
 * @returns {Object} - { allowed: boolean, count: number, remaining: number }
 */
export const checkAndUpdateLimit = (userId) => {
  const today = new Date().toDateString()

  // Inicializar datos del usuario si no existen
  if (!global.db.data.users[userId]) {
    global.db.data.users[userId] = {}
  }

  if (!global.db.data.users[userId].mayeditor) {
    global.db.data.users[userId].mayeditor = { count: 0, date: today }
  }

  const userLimit = global.db.data.users[userId].mayeditor

  // Resetear contador si es un nuevo día
  if (userLimit.date !== today) {
    userLimit.count = 0
    userLimit.date = today
  }

  // Verificar si ha excedido el límite
  if (userLimit.count >= CONFIG.DAILY_LIMIT) {
    return {
      allowed: false,
      count: userLimit.count,
      remaining: 0
    }
  }

  // Incrementar contador
  userLimit.count++

  return {
    allowed: true,
    count: userLimit.count,
    remaining: CONFIG.DAILY_LIMIT - userLimit.count
  }
}

/**
 * Revertir el contador de uso (para casos de error)
 * @param {string} userId - ID del usuario
 */
export const revertUsageCount = (userId) => {
  if (global.db.data.users[userId]?.mayeditor?.count > 0) {
    global.db.data.users[userId].mayeditor.count--
  }
}

/**
 * Obtener estadísticas de uso del usuario
 * @param {string} userId - ID del usuario
 * @returns {Object} - { count: number, remaining: number, date: string }
 */
export const getUserStats = (userId) => {
  const today = new Date().toDateString()
  
  if (!global.db.data.users[userId]?.mayeditor) {
    return {
      count: 0,
      remaining: CONFIG.DAILY_LIMIT,
      date: today
    }
  }

  const userLimit = global.db.data.users[userId].mayeditor

  // Si es un nuevo día, mostrar límite completo
  if (userLimit.date !== today) {
    return {
      count: 0,
      remaining: CONFIG.DAILY_LIMIT,
      date: today
    }
  }

  return {
    count: userLimit.count,
    remaining: Math.max(0, CONFIG.DAILY_LIMIT - userLimit.count),
    date: userLimit.date
  }
      }
