import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

  let coins = [
    'bitcoin', 
    'ethereum', 
    'dogecoin',
    'shiba-inu',
    'litecoin',
    'ripple',
    'tron',
    'cardano',
    'polkadot',
    'stellar'
  ].join(',')

  let apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd`
  
  try {
    let res = await fetch(apiURL)
    let json = await res.json()

    if (!json.bitcoin) throw 'No se pudo obtener la info, intenta más tarde ⊂(・▽・)⊃'

    let btc = json.bitcoin.usd
    let eth = json.ethereum.usd

    let fraseBTC = btc > 30000 ? '🚀 El Bitcoin está carísimo, hora de vender y comprarte unos ramen jeje 🍜' :
                  btc < 15000 ? '🥀 El Bitcoin está en la tumba, Hanako-Kun lo está vigilando desde el baño fantasma...' :
                  '🔮 El Bitcoin está estable, pero cuidado que los fantasmas son impredecibles~'

    let fraseETH = eth > 3000 ? '✨ El Ethereum está brillando más que las estrellas de Yashiro~' :
                  eth < 1000 ? '💧 Ethereum se está derritiendo como tu dignidad cuando ves a tu crush...' :
                  '🌸 Ethereum tranqui, como los conejitos del infierno jeje.'

    let msg = `
╭─━✧『 𝑯𝒂𝒏𝒂𝒌𝒐 𝑲𝒖𝒏 ✧ 𝑩𝒊𝒕𝒄𝒐𝒊𝒏 』━─╮

💰 *Bitcoin:* $${btc} USD  
${fraseBTC}

💎 *Ethereum:* $${eth} USD  
${fraseETH}

🎃 *Otras Criptos:*
${Object.entries(json).filter(([k]) => k !== 'bitcoin' && k !== 'ethereum').map(([k, v]) => `• ${k}: $${v.usd}`).join('\n')}

⛩️ Información mística traída desde los pasillos del Inodoro Fantasmal...

╰─━━✧⭑⭑⭑⭑⭑━━─╯`

    m.reply(msg)

  } catch (e) {
    console.error(e)
    m.reply(`⚠️ Error al obtener los precios... Los espíritus están interferiendo (⁠｡⁠•́︿•̀｡⁠)`)
  }
}

handler.help = ['btc']
handler.tags = ['cripto', 'info']
handler.command = ['btc']

export default handler
