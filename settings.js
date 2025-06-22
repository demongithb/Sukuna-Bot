import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 51921826291

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = ['51971285104', '51921826291'];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = [] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'MayBaileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'Tanjiro'
global.namebot = '𝐓𝐀𝐍𝐉𝐈𝐑𝐎-𝐁𝐎𝐓 𝐌𝐃'
global.sessions = './Sessions'
global.jadi = 'MayBots' 
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '𝐓𝐀𝐍𝐉𝐈𝐑𝐎-𝐁𝐎𝐓 𝐌𝐃'
global.botname = '𝐓𝐀𝐍𝐉𝐈𝐑𝐎-𝐁𝐎𝐓 𝐌𝐃'
global.wm = '𝐓𝐀𝐍𝐉𝐈𝐑𝐎-𝐁𝐎𝐓 𝐌𝐃'
global.author = 'ᴅᴀʀᴋ ʙʀxᴢᴢᴢ'
global.dev = 'ᴅᴀʀᴋ ʙʀxᴢᴢᴢ'
global.textbot = '𝐓𝐀𝐍𝐉𝐈𝐑𝐎-𝐁𝐎𝐓 𝐌𝐃 • ᴅᴀʀᴋ ʙʀxᴢᴢᴢ'
global.etiqueta = 'ᴅᴀʀᴋ ʙʀxᴢᴢᴢ'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = 'Coins'
global.welcom1 = '❍ Edita Con El Comando setwelcome'
global.welcom2 = '❍ Edita Con El Comando setbye'
global.banner = 'https://files.catbox.moe/xc7841.jpeg'
global.avatar = 'https://files.catbox.moe/3qyzmz.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R'
global.comunidad1 = 'https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R'
global.channel = 'https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R'
global.channel2 = 'https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R'
global.md = 'https://github.com/SoySapo6/TanjitoBot'
global.correo = 'soymaycol.cn@gmail.com'
global.cn ='https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R';
global.owner_ngl ='soymaycol1';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363420010803947@newsletter',
}
global.multiplier = 70

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
  
