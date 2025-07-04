import axios from 'axios'
import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, text }) => {
const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
const username = `${conn.getName(m.sender)}`
const botname = 'MaycolAIUltraMD'
const creador = 'SoyMaycol'
const vs = '4.0-Hanako'
const emoji = '✨'
const emoji2 = '💬'
const msm = '🚨'
const rwait = '⏳'
const done = '✅'
const error = '❌'

if (!global.db.data.users) global.db.data.users = {}
if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}

const basePrompt = `Tu nombre es ${botname}, fuiste creado por ${creador}. Eres una IA kawaii, divertida y temática de Hanako-kun (⊂(・▽・)⊃). Tu versión es ${vs}. Amas aprender y siempre llamas a las personas por su nombre (${username}). Puedes usar variables especiales como: [AntiNSFW (on)], [AntiNSFW (off)], [Coins (+50)], [XP (+30)], [Nivel (+1)], [RPGGold (50)], [RPGDiamond (10)], [RPGRuby (5)], [RPGEmerald (7)], [RPGVitality (3)], [RPGStrength (4)], [RPGIntelligence (2)], [RPGCharisma (2)], [RPGAgility (3)], [RPGPickaxe (1)], [RPGWeapon (1)], [RPGArmor (1)], [RPGHouse (1)], [RPGFarm (1)], [RPGStamina (5)], [RPGHealth (5)], [RPGPotion (5)], [RPGFood (5)], [RPGSeeds (5)]. No inventes otras variables.`

if (isQuotedImage) {
const q = m.quoted
const img = await q.download?.()
if (!img) return conn.reply(m.chat, `${msm} Error: No pude descargar la imagen (⁠｡⁠•́⁠︿⁠•̀⁠｡⁠)`, m)

const content = `${emoji} ¿Qué se observa en la imagen?`
try {
const imageAnalysis = await fetchImageBuffer(content, img)
const query = `${emoji} Describe la imagen y usa variables si lo crees necesario.`
const prompt = `${basePrompt} La imagen es: ${imageAnalysis.result}`
let description = await hanakoAI(query, username, prompt)
await ejecutarVariables(description, conn, m)
description = limpiarVariables(description)
await conn.reply(m.chat, description, m)
} catch {
await m.react(error)
await conn.reply(m.chat, '❌ No pude analizar la imagen (⁠つ⁠﹏⁠<̶̑̑)', m)
}
} else {
if (!text) return conn.reply(m.chat, `${emoji} Dime algo para responderte, jeje~ (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤`, m)
await m.react(rwait)
try {
const { key } = await conn.sendMessage(m.chat, { text: `${emoji2} HanakoAI está pensando... espera un poquito UwU~` }, { quoted: m })
const query = text
const prompt = `${basePrompt} Responde lo siguiente de forma tierna, como Hanako-kun: ${query}`
let response = await hanakoAI(query, username, prompt)
await ejecutarVariables(response, conn, m)
response = limpiarVariables(response)
await conn.sendMessage(m.chat, { text: response, edit: key })
await m.react(done)
} catch {
await m.react(error)
await conn.reply(m.chat, '❌ No pude responder esa pregunta, perdóncito (⁠｡⁠•́⁠︿⁠•̀⁠｡⁠)', m)
}
}
}

handler.help = ['hanakoai', 'chatgpt']
handler.tags = ['ai']
handler.command = ['hanakoai', 'maycolaiultramd', 'hanako']
handler.group = true
// export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchImageBuffer(content, imageBuffer) {
try {
const response = await axios.post('https://Luminai.my.id', { content, imageBuffer }, { headers: { 'Content-Type': 'application/json' } })
return response.data
} catch (error) {
console.error('Error:', error)
throw error
}}

async function hanakoAI(q, username, logic) {
try {
const response = await axios.post('https://Luminai.my.id', { content: q, user: username, prompt: logic, webSearchMode: false })
return response.data.result
} catch (error) {
console.error('Error al interactuar con la IA:', error)
throw error
}}

async function ejecutarVariables(respuesta, conn, m) {
const vars = {
AntiNSFWon: /\[AntiNSFW \(on\)\]/i,
AntiNSFWoff: /\[AntiNSFW \(off\)\]/i,
Coins: /\[Coins \(\+(\d+)\)\]/i,
XP: /\[XP \(\+(\d+)\)\]/i,
Nivel: /\[Nivel \(\+(\d+)\)\]/i,
Gold: /\[RPGGold \((\d+)\)\]/i,
Diamond: /\[RPGDiamond \((\d+)\)\]/i,
Ruby: /\[RPGRuby \((\d+)\)\]/i,
Emerald: /\[RPGEmerald \((\d+)\)\]/i,
Vitality: /\[RPGVitality \((\d+)\)\]/i,
Strength: /\[RPGStrength \((\d+)\)\]/i,
Intelligence: /\[RPGIntelligence \((\d+)\)\]/i,
Charisma: /\[RPGCharisma \((\d+)\)\]/i,
Agility: /\[RPGAgility \((\d+)\)\]/i,
Pickaxe: /\[RPGPickaxe \((\d+)\)\]/i,
Weapon: /\[RPGWeapon \((\d+)\)\]/i,
Armor: /\[RPGArmor \((\d+)\)\]/i,
House: /\[RPGHouse \((\d+)\)\]/i,
Farm: /\[RPGFarm \((\d+)\)\]/i,
Stamina: /\[RPGStamina \((\d+)\)\]/i,
Health: /\[RPGHealth \((\d+)\)\]/i,
Potion: /\[RPGPotion \((\d+)\)\]/i,
Food: /\[RPGFood \((\d+)\)\]/i,
Seeds: /\[RPGSeeds \((\d+)\)\]/i,
}

if (!global.db.data.chats) global.db.data.chats = {}
if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
if (!global.db.data.users) global.db.data.users = {}
if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}

let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]

if (vars.AntiNSFWon.test(respuesta)) chat.antiNsfw = true
if (vars.AntiNSFWoff.test(respuesta)) chat.antiNsfw = false

for (let [key, regex] of Object.entries(vars)) {
if (['AntiNSFWon', 'AntiNSFWoff'].includes(key)) continue
if (regex.test(respuesta)) {
let cantidad = parseInt(respuesta.match(regex)[1])
user[key.toLowerCase()] = (user[key.toLowerCase()] || 0) + cantidad
console.log(`✨ HanakoAI otorgó ${cantidad} de ${key} a ${m.sender}`)
}
}
}

function limpiarVariables(texto) {
return texto.replace(/\[(.*?)\]/g, '').trim()
  }
