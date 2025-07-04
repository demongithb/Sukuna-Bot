let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  if (!user) return conn.reply(m.chat, 'Tu cuenta no existe en el RPG.', m)

  // Le das todo chetadooo
  user.gold = 999999
  user.diamond = 9999
  user.emerald = 9999
  user.ruby = 9999
  user.exp = 9999999
  user.level = 100
  user.strength = 999
  user.agility = 999
  user.intelligence = 999
  user.charisma = 999
  user.vitality = 999
  user.pickaxe = 10
  user.weapon = 10
  user.armor = 10
  user.farm = 5
  user.house = 5
  user.stamina = 100
  user.health = 100
  user.potion = 99
  user.food = 99
  user.seeds = 99

  conn.reply(m.chat, '🔥 ¡Estás totalmente chetado! Dale con todo al RPG. ⚔️', m)
}
handler.command = ['rpgchetar']
handler.owner = true // Solo el owner puede usarlo, puedes quitar si quieres

export default handler
