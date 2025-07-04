import axios from 'axios';
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const NIGHT_API_ENDPOINTS = [
  'https://nightapioficial.onrender.com',
  'https://nightapi-2a6l.onrender.com',
  'https://nightapi.is-a.dev'
];

// Función para detectar el tipo de código y determinar la extensión
function detectCodeType(code) {
  const codeStr = code.toLowerCase().trim();
  
  // Detectores de lenguajes de programación
  const detectors = {
    // Web Technologies
    'html': [
      /<!doctype\s+html/i,
      /<html[\s>]/i,
      /<head[\s>]/i,
      /<body[\s>]/i,
      /<div[\s>]/i,
      /<script[\s>]/i
    ],
    'css': [
      /^\s*[.#][\w-]+\s*\{/m,
      /@media\s/i,
      /:\s*[^;]+;/m,
      /background-color\s*:/i,
      /font-family\s*:/i
    ],
    'js': [
      /function\s+\w+\s*\(/i,
      /const\s+\w+\s*=/i,
      /let\s+\w+\s*=/i,
      /var\s+\w+\s*=/i,
      /console\.log\s*\(/i,
      /document\./i,
      /window\./i,
      /=>\s*\{/i,
      /require\s*\(/i,
      /import\s+.*from/i,
      /export\s+(default\s+)?/i
    ],
    
    // Backend Languages
    'py': [
      /def\s+\w+\s*\(/i,
      /import\s+\w+/i,
      /from\s+\w+\s+import/i,
      /print\s*\(/i,
      /if\s+__name__\s*==\s*['"]__main__['"]/i,
      /class\s+\w+[\s(:]/i
    ],
    'java': [
      /public\s+class\s+\w+/i,
      /public\s+static\s+void\s+main/i,
      /System\.out\.print/i,
      /import\s+java\./i,
      /package\s+[\w.]+;/i
    ],
    'cpp': [
      /#include\s*<[\w.]+>/i,
      /using\s+namespace\s+std/i,
      /int\s+main\s*\(/i,
      /cout\s*<<|cin\s*>>/i,
      /std::/i
    ],
    'c': [
      /#include\s*<[\w.]+\.h>/i,
      /int\s+main\s*\(/i,
      /printf\s*\(/i,
      /scanf\s*\(/i,
      /malloc\s*\(/i
    ],
    'php': [
      /<\?php/i,
      /\$\w+\s*=/i,
      /echo\s+/i,
      /function\s+\w+\s*\(/i,
      /class\s+\w+/i
    ],
    
    // Database
    'sql': [
      /select\s+.*\s+from\s+/i,
      /insert\s+into\s+/i,
      /update\s+.*\s+set\s+/i,
      /delete\s+from\s+/i,
      /create\s+table\s+/i,
      /alter\s+table\s+/i
    ],
    
    // Configuration Files
    'json': [
      /^\s*\{[\s\S]*\}\s*$/,
      /"\w+"\s*:\s*["[\{]/
    ],
    'xml': [
      /<\?xml\s+version/i,
      /<[\w:-]+[\s>]/,
      /<\/[\w:-]+>/
    ],
    'yml': [
      /^[\w-]+:\s*$/m,
      /^\s+-\s+/m,
      /^---\s*$/m
    ],
    'yaml': [
      /^[\w-]+:\s*$/m,
      /^\s+-\s+/m,
      /^---\s*$/m
    ],
    
    // Shell Scripts
    'sh': [
      /^#!\/bin\/(bash|sh)/,
      /echo\s+/i,
      /if\s+\[.*\]\s*;\s*then/i,
      /for\s+\w+\s+in\s+/i
    ],
    'bat': [
      /@echo\s+(off|on)/i,
      /set\s+\w+=/i,
      /goto\s+\w+/i,
      /:\w+/
    ],
    
    // Other Languages
    'go': [
      /package\s+main/i,
      /import\s+\(/i,
      /func\s+\w+\s*\(/i,
      /fmt\.Print/i
    ],
    'rs': [
      /fn\s+main\s*\(/i,
      /let\s+mut\s+/i,
      /println!\s*\(/i,
      /use\s+std::/i
    ],
    'rb': [
      /def\s+\w+/i,
      /puts\s+/i,
      /class\s+\w+/i,
      /require\s+["']/i
    ],
    'kt': [
      /fun\s+main\s*\(/i,
      /class\s+\w+/i,
      /println\s*\(/i,
      /package\s+[\w.]+/i
    ],
    'swift': [
      /import\s+Foundation/i,
      /func\s+\w+\s*\(/i,
      /print\s*\(/i,
      /class\s+\w+/i
    ]
  };
  
  // Buscar coincidencias
  for (const [extension, patterns] of Object.entries(detectors)) {
    const matches = patterns.filter(pattern => pattern.test(codeStr)).length;
    if (matches > 0) {
      return extension;
    }
  }
  
  // Si no se detecta nada específico, usar 'txt'
  return 'txt';
}

// Función para verificar si el texto contiene código
function isCode(text) {
  const codeIndicators = [
    // Palabras clave de programación
    /\b(function|const|let|var|if|else|for|while|class|def|import|export|return)\b/i,
    // Símbolos típicos de código
    /[{}();=<>+\-*\/%&|!]/,
    // Estructuras de código
    /^\s*[\w.-]+\s*[=:]\s*.+$/m,
    // Comentarios
    /\/\/|\/\*|\*\/|#|<!--/,
    // Etiquetas HTML
    /<\/?[a-z][\s\S]*>/i,
    // Declaraciones SQL
    /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE)\b/i
  ];
  
  return codeIndicators.some(pattern => pattern.test(text));
}

async function fetchMayCode(version, prompt, imageUrl = null) {
  let paths;
  
  if (imageUrl) {
    paths = {
      v1: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`,
      v2: `/api/maycode/models/v3/?message=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`
    };
  } else {
    paths = {
      v1: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}`,
      v2: `/api/maycode/models/v3/?message=${encodeURIComponent(prompt)}`
    };
  }

  for (let baseURL of NIGHT_API_ENDPOINTS) {
    try {
      const res = await axios.get(baseURL + paths[version]);
      const data = res.data;

      if (data && (data.MayCode || data.code)) return data;

      console.log(`⚠️ Respuesta vacía de ${baseURL}, intentando con otro...`);
    } catch (err) {
      console.log(`❌ Falló ${baseURL}: ${err.message}`);
    }
  }

  throw new Error('Todas las instancias de NightAPI están fuera de servicio.');
}

async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}

const handler = async (m, { conn, text }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  let hasImage = /image\/(png|jpe?g|gif)/.test(mime);
  let imageUrl = null;

  if (!text && !hasImage) {
    conn.reply(m.chat, `⚠️ 𝙃𝙚𝙮 𝙘𝙤𝙣𝙚𝙟𝙞𝙩𝙤 ✨ Te faltó el texto para usar *MayCode* ✍️\n\nUsa:\n— *--v1* para el modelo básico\n— *--v2* para el modelo avanzado Hanako-Kawaii\n\n📸 También puedes enviar una imagen junto con tu mensaje`, m);
    return;
  }

  let version = 'v1';
  let prompt = text || 'Analiza esta imagen';

  if (text && text.startsWith('--v1 ')) {
    version = 'v1';
    prompt = text.substring(5).trim();
  } else if (text && text.startsWith('--v2 ')) {
    version = 'v2';
    prompt = text.substring(5).trim();
  }

  let loadingMsg = `━━━━━━━━━━━━━━━━━━━━━  
✧･ﾟ: *✧･ﾟ:* *𝙈𝙖𝙮𝘾𝙤𝙙𝙚* *:･ﾟ✧*:･ﾟ✧  
━━━━━━━━━━━━━━━━━━━━━  

(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ *Espérame que estoy pensando código mágico...*  
*Modelo:* MayCode ${version}`;

  if (hasImage) {
    loadingMsg += `\n📸 *Procesando imagen...*`;
  }

  loadingMsg += `\n✨ Hecho con amor por *SoyMaycol* ✨  
━━━━━━━━━━━━━━━━━━━━━`;

  await conn.reply(m.chat, loadingMsg, m);

  try {
    if (hasImage) {
      try {
        let media = await q.download();
        imageUrl = await catbox(media);
        console.log(`📸 Imagen subida: ${imageUrl}`);
      } catch (imgError) {
        console.error('Error al subir imagen:', imgError);
        await conn.reply(m.chat, `❌ Error al procesar la imagen. Continuando solo con texto...`, m);
      }
    }

    const data = await fetchMayCode(version, prompt, imageUrl);

    const userText = data.user || prompt;
    const mayCodeText = data.MayCode || '(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄ No pude darte una respuesta, lo siento';
    const codeBlock = data.code || '(⁠・⁠∀⁠・⁠) Al Parecer MayCode solo te Hablo ^^';

    // Verificar si hay código en la respuesta
    const hasCode = isCode(codeBlock) && codeBlock !== '(⁠・⁠∀⁠・⁠) Al Parecer MayCode solo te Hablo ^^';

    let respuesta = `
*┏━━━━━━✦°•✦°•✦━━━━━━┓*
   『 𝗠𝗔𝗬𝗖𝗢𝗗𝗘 ${version.toUpperCase()} 』
*┗━━━━━━✦°•✦°•✦━━━━━━┛*

╭───────────────╮  
│ 🧑‍💻 𝙏𝙪: *${userText}*`;

    if (imageUrl) {
      respuesta += `\n│ 📸 𝙄𝙢𝙖𝙜𝙚𝙣: Procesada ✅`;
    }

    respuesta += `  
│ ✨ 𝙈𝙖𝙮𝘾𝙤𝙙𝙚: *${mayCodeText}*  
╰───────────────╯`;

    if (hasCode) {
      // Detectar tipo de código y extensión
      const fileExtension = detectCodeType(codeBlock);
      const fileName = `maycode_${Date.now()}.${fileExtension}`;
      
      respuesta += `> Hecho por SoyMaycol y Impulsado por NightAPI`;
      
      // Enviar respuesta de texto primero
      await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
      
      // Luego enviar el archivo con el código
      const codeBuffer = Buffer.from(codeBlock, 'utf-8');
      
      await conn.sendMessage(m.chat, {
        document: codeBuffer,
        fileName: fileName,
        mimetype: 'text/plain',
        caption: `📝 *Código generado por MayCode ${version.toUpperCase()}*\n\n🔧 *Tipo detectado:* ${fileExtension.toUpperCase()}\n💬 *Consulta:* ${userText}\n\n> 💖 Código con amor por *SoyMaycol*`
      }, { quoted: m });
      
    } else {
      // Si no hay código, mostrar respuesta normal
      respuesta += `\n\n⊹︰𝗥𝗲𝘀𝗽𝘂𝗲𝘀𝘁𝗮:
\`\`\`
${codeBlock}
\`\`\``;

      await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
    }

    respuesta += `\n\n> (｡･ω･｡)ﾉ♡ Usando NightAPI — powered by SoyMaycol\n━━━━━━━━━━━━━━━━━━━━━`;

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, {
      text: `⊹⊱⋛⋋(◍'◊'◍)⋌⋚⊰⊹

(｡╯︵╰｡) Ay no… ¡algo falló con NightAPI!

Todas las instancias están fuera de servicio…  
Intenta de nuevo más tardecito, mi cielito ☁️✨

> Código con amor por *SoyMaycol* 💖
`
    }, { quoted: m });
  }
};

handler.help = ['maycode'];
handler.tags = ['tools'];
handler.command = ['maycode', 'codigo'];
handler.register = true;

export default handler;
