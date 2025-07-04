// Comando para obtener un mensaje "maycute" desde una API.
import fetch from 'node-fetch'; // Importa la librería 'node-fetch' para hacer peticiones HTTP.

const handler = async (m, { conn }) => {
  // Define el handler para el comando.
  if (/maycute/i.test(m.text)) {
    // Verifica si el mensaje contiene la palabra "maycute" (insensible a mayúsculas/minúsculas).
    try {
      // Intenta realizar la petición a la API.
      const userInput = m.text.replace(/^\.?maycute/i, '').trim() || '';
      const apiUrl = `https://nightapi.is-a.dev/api/maycute?message=${encodeURIComponent(userInput)}`;
      
      const response = await fetch(apiUrl); // Realiza la petición a la API y espera la respuesta.

      if (!response.ok) {
        // Verifica si la respuesta de la API fue exitosa (código de estado 200-299).
        throw new Error(`HTTP error! status: ${response.status}`); // Lanza un error si la respuesta no fue exitosa.
      }

      const data = await response.json(); // Convierte la respuesta de la API a formato JSON y espera el resultado.

      if (data && data.Message) {
        // Verifica si la respuesta JSON contiene un campo "message".
        await conn.reply(m.chat, data.Message, m); // Envía el mensaje extraído de la API como respuesta al chat.
      } else {
        // Si no se encuentra el campo "message" en la respuesta JSON.
        await conn.reply(m.chat, '¡Ups! Te olvidaste ingresar tu frase.', m); // Envía un mensaje de error indicando que no se encontró el mensaje.
      }
    } catch (error) {
      // Captura cualquier error que ocurra durante la petición o procesamiento de la respuesta.
      console.error('Error al obtener el mensaje:', error); // Imprime el error en la consola del servidor.
      await conn.reply(m.chat, '¡Ups! Te olvidaste ingresar tu frase.', m); // Envía un mensaje de error al chat.
    }
  }
};

handler.help = ['maycute']; // Define la ayuda para el comando.
handler.tags = ['ai']; // Define la categoría del comando.
handler.command = ['maycute']; // Define el comando que activa este handler.
handler.register = true; // Indica que este comando debe ser registrado.

export default handler;
