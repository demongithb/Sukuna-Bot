import fetch from 'node-fetch'

export async function detectarNSFW(urlImagen) {
    try {
        let res = await fetch(`https://delirius-apiofc.vercel.app/tools/checknsfw?image=${encodeURIComponent(urlImagen)}`)
        let json = await res.json()
        if (!json || !json.data) throw new Error('Respuesta inválida de la API')
        
        return {
            nsfw: json.data.NSFW,
            porcentaje: parseFloat(json.data.percentage.replace('%', '')),
            mensaje: json.data.response
        }
    } catch (e) {
        console.error('Error al detectar NSFW:', e)
        return { nsfw: false, porcentaje: 0, mensaje: 'Error' }
    }
}
