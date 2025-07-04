let handler = async (m, { args, usedPrefix, command }) => {
    global.comandosEnMantenimiento = global.comandosEnMantenimiento || []

    if (!args[0]) {
        if (global.comandosEnMantenimiento.length === 0) {
            return m.reply('✨ No hay comandos en mantenimiento actualmente.')
        }
        return m.reply(`⚙️ Comandos en mantenimiento:\n- ${global.comandosEnMantenimiento.join('\n- ')}`)
    }

    if (args[0] === 'off' && args[1]) {
        let idx = global.comandosEnMantenimiento.indexOf(args[1].toLowerCase())
        if (idx >= 0) {
            global.comandosEnMantenimiento.splice(idx, 1)
            return m.reply(`✅ El comando *${args[1]}* ya no está en mantenimiento.`)
        } else {
            return m.reply(`Ese comando no estaba en mantenimiento.`)
        }
    }

    let cmd = args[0].toLowerCase()
    if (global.comandosEnMantenimiento.includes(cmd)) {
        return m.reply(`El comando *${cmd}* ya estaba en mantenimiento.`)
    }

    global.comandosEnMantenimiento.push(cmd)
    return m.reply(`⚒️ El comando *${cmd}* ahora está en mantenimiento.`)
}

handler.command = ['mantenimiento']
handler.rowner = true // Solo el dueño puede usarlo
export default handler
