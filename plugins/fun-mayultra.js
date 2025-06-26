import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  conn.reply(m.chat, `╭─❍「 ✦ ᴅᴀʀᴋ ʙʀxᴢᴢᴢ ✦ 」    
│    
├─ El hechizo *#darkultra* no existe en los registros del más allá.    
│    
├─ ¿Quisiste decir *#darkletras*?    
│   ⇝ *#help*    
╰─✦`, m)

  let tiempoEspera = Math.floor(Math.random() * 7000) + 3000

  const obtenerDatoAleatorio = async () => {
    try {
      const apis = [
        {
          url: 'https://api.adviceslip.com/advice',
          procesador: (data) => `💡 *Consejo del día:* ${data.slip.advice}`
        },
        {
          url: 'https://api.chucknorris.io/jokes/random',
          procesador: (data) => `😂 *Chuck Norris dice:* ${data.value}`
        },
        {
          url: 'https://official-joke-api.appspot.com/random_joke',
          procesador: (data) => `🤣 *Chiste:* ${data.setup}\n*Respuesta:* ${data.punchline}`
        },
        {
          url: 'https://api.quotable.io/random',
          procesador: (data) => `📖 *Frase inspiradora:* "${data.content}" - ${data.author}`
        },
        {
          url: 'https://catfact.ninja/fact',
          procesador: (data) => `🐱 *Dato curioso sobre gatos:* ${data.fact}`
        },
        {
          url: 'https://uselessfacts.jsph.pl/random.json?language=en',
          procesador: (data) => `🤔 *Dato inútil pero interesante:* ${data.text}`
        },
        {
          url: 'https://api.kanye.rest/',
          procesador: (data) => `🎤 *Kanye West dijo:* "${data.quote}"`
        }
      ]

      const apiAleatoria = apis[Math.floor(Math.random() * apis.length)]
      const response = await fetch(apiAleatoria.url)
      const data = await response.json()
      
      return apiAleatoria.procesador(data)
    } catch (error) {
      return null
    }
  }

  let eventos = [
    '🎁 *Te ganaste 100 MayCoins… nah, es broma jsjs*',
    '✨ *Te llegó suerte por 3 horas según los fantasmas~*',
    '🌟 *Alguien pensó en ti justo ahora... ¿Quién será?*',
    '👻 *Hanako te está observando detrás de la puerta… cuidado*',
    '💌 *Recibirás un mensaje inesperado hoy… o mañana, o nunca jsjs*',
    '🎭 *Los espíritus dicen que tendrás un día interesante*',
    '🔮 *Tu aura brilla más de lo normal hoy*',
    '🎪 *Un payaso invisible acaba de pasar por aquí*',
    '🌙 *La luna te envía buenas vibras esta noche*',
    '🦋 *Una mariposa cósmica te dedicó un vuelo*',
    '🎨 *Tu creatividad aumentará en las próximas horas*',
    '🍀 *Encontrarás algo perdido que ni sabías que habías perdido*',
    '🎯 *Hoy es tu día de suerte en los juegos*',
    '🌈 *Un arcoíris invisible apareció sobre tu cabeza*',
    '🎵 *Los ángeles están cantando tu canción favorita*',
    '🦄 *Un unicornio te envió bendiciones desde otra dimensión*',
    '🌊 *Las olas del océano susurran tu nombre*',
    '⚡ *Tienes poderes especiales por las próximas 2 horas*',
    '🎪 *El circo de los sueños te invita a su función*',
    '🌻 *Una flor en Japón acaba de crecer pensando en ti*',
    '🎲 *Los dados del destino cayeron a tu favor*',
    '🦋 *Mariposas de otro mundo te están aplaudiendo*',
    '🌙 *La diosa de la luna te sonrió*',
    '🎪 *Un mago invisible acaba de hacer un truco para ti*',
    '🌟 *Eres la estrella más brillante del chat ahora mismo*'
  ]

  setTimeout(async () => {
    let mensaje = '¡Espera! ¡Espera! No te vayas (⁠っ⁠˘̩⁠╭⁠╮⁠˘̩⁠)⁠っ\n\n¡Tengo una sorpresa para Ti! (⁠•⁠ ⁠▽⁠ ⁠•⁠;⁠)\n\n'
    
    const probabilidadAPI = Math.random()
    
    if (probabilidadAPI < 0.4) {
      const datoAPI = await obtenerDatoAleatorio()
      if (datoAPI) {
        mensaje += `${datoAPI}\n\n> ✨ *Dato especial traído desde el internet místico*`
      } else {
        const eventoAleatorio = eventos[Math.floor(Math.random() * eventos.length)]
        mensaje += `${eventoAleatorio}`
      }
    } else {
      const eventoAleatorio = eventos[Math.floor(Math.random() * eventos.length)]
      mensaje += `${eventoAleatorio}`
    }
    
    mensaje += '\n\n> ᴅᴀʀᴋ ʙʀxᴢᴢᴢ'
    
    conn.reply(m.chat, mensaje, m)
  }, tiempoEspera)

}

handler.help = ['darkultra']
handler.tags = ['fun']
handler.command = ['darkultra']

export default handler
