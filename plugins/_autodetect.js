let WAMessageStubType = (await import('@soymaycol/maybailyes')).default  

let handler = m => m  

handler.before = async function (m, { conn, participants, groupMetadata }) {  
    if (!m.messageStubType || !/(@g\.us|@lid)$/i.test(m.chat)) return  

    const sender = m.sender || ''
    const param0 = m.messageStubParameters?.[0] || ''

    const fkontak = { 
        "key": { "participants": "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, 
        "message": { 
            "contactMessage": { 
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
            } 
        }, 
        "participant": "0@s.whatsapp.net"
    }    

    let chat = global.db.data.chats[m.chat]  
    let usuario = `@${sender.split('@')[0]}`  
    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'  
    
    let nombre = `《✦》${usuario} Ha cambiado el nombre del grupo.\n\n> ✧ Ahora el grupo se llama:\n> *${param0}*.`  
    let foto = `《✦》Se ha cambiado la imagen del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`  
    let edit = `《✦》${usuario} Ha permitido que ${param0 == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`  
    let newlink = `《✦》El enlace del grupo ha sido restablecido.\n\n> ✧ Acción hecha por:\n> » ${usuario}`  
    let status = `《✦》El grupo ha sido ${param0 == 'on' ? '*cerrado*' : '*abierto*'} Por ${usuario}\n\n> ✧ Ahora ${param0 == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`  
    let admingp = `《✦》@${param0.split('@')[0]} Ahora es admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`  
    let noadmingp = `《✦》@${param0.split('@')[0]} Deja de ser admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`  
    
    if (chat.detect && m.messageStubType == 21) {  
        await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })     
    } else if (chat.detect && m.messageStubType == 22) {  
        await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })  
    } else if (chat.detect && m.messageStubType == 23) {  
        await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })      
    } else if (chat.detect && m.messageStubType == 25) {  
        await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })    
    } else if (chat.detect && m.messageStubType == 26) {  
        await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })    
    } else if (chat.detect && m.messageStubType == 29) {  
        await conn.sendMessage(m.chat, { text: admingp, mentions: [m.sender, param0] }, { quoted: fkontak })    
    } else if (chat.detect && m.messageStubType == 30) {  
        await conn.sendMessage(m.chat, { text: noadmingp, mentions: [m.sender, param0] }, { quoted: fkontak })  
    } else {  
        if (m.messageStubType == 2) return  
        console.log({  
            messageStubType: m.messageStubType,  
            messageStubParameters: m.messageStubParameters,  
            type: WAMessageStubType[m.messageStubType],   
        })  
    }  
}  

export default handler
