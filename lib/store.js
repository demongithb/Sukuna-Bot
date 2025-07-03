import { readFileSync, writeFileSync, existsSync } from "fs";
const { initAuthCreds, BufferJSON, proto } = (await import("@soymaycol/maybailyes")).default;

const isGroupId = id => id?.endsWith("@g.us") || id?.endsWith("@lid");

function bind(conn) {
  if (!conn.chats) conn.chats = {};

  function updateNameToDb(contacts) {
    if (!contacts) return;
    try {
      contacts = contacts.contacts || contacts;
      for (const contact of contacts) {
        const id = conn.decodeJid(contact.id);
        if (!id || id === "status@broadcast") continue;
        let chats = conn.chats[id];
        if (!chats) chats = conn.chats[id] = { ...contact, id };
        
        conn.chats[id] = {
          ...chats,
          ...({
            ...contact,
            id,
            ...(isGroupId(id)
              ? { subject: contact.subject || contact.name || chats.subject || "" }
              : { name: contact.notify || contact.name || chats.name || chats.notify || "" })
          } || {}),
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  conn.ev.on("contacts.upsert", updateNameToDb);
  conn.ev.on("groups.update", updateNameToDb);
  conn.ev.on("contacts.set", updateNameToDb);

  conn.ev.on("chats.set", async ({ chats }) => {
    try {
      for (let { id, name, readOnly } of chats) {
        id = conn.decodeJid(id);
        if (!id || id === "status@broadcast") continue;
        const isGroup = isGroupId(id);
        
        let chat = conn.chats[id];
        if (!chat) chat = conn.chats[id] = { id };

        chat.isChats = !readOnly;
        if (name) chat[isGroup ? "subject" : "name"] = name;

        if (isGroup) {
          const metadata = await conn.groupMetadata(id).catch(() => null);
          if (name || metadata?.subject) chat.subject = name || metadata.subject;
          if (metadata) chat.metadata = metadata;
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  conn.ev.on("group-participants.update", async ({ id, participants, action }) => {
    if (!id) return;
    id = conn.decodeJid(id);
    if (id === "status@broadcast") return;
    
    if (!(id in conn.chats)) conn.chats[id] = { id };
    
    const chat = conn.chats[id];
    chat.isChats = true;
    const metadata = await conn.groupMetadata(id).catch(() => null);
    if (!metadata) return;
    chat.subject = metadata.subject;
    chat.metadata = metadata;
  });

  conn.ev.on("groups.update", async (groupsUpdates) => {
    try {
      for (const update of groupsUpdates) {
        const id = conn.decodeJid(update.id);
        if (!id || id === "status@broadcast" || !isGroupId(id)) continue;

        let chat = conn.chats[id];
        if (!chat) chat = conn.chats[id] = { id };

        chat.isChats = true;
        const metadata = await conn.groupMetadata(id).catch(() => null);
        if (metadata) chat.metadata = metadata;
        if (update.subject || metadata?.subject) chat.subject = update.subject || metadata.subject;
      }
    } catch (e) {
      console.error(e);
    }
  });

  conn.ev.on("chats.upsert", (chatsUpsert) => {
    try {
      const { id, name } = chatsUpsert;
      if (!id || id === "status@broadcast") return;

      conn.chats[id] = {
        ...(conn.chats[id] || {}),
        ...chatsUpsert,
        isChats: true,
      };

      if (isGroupId(id)) conn.insertAllGroup().catch(() => null);
    } catch (e) {
      console.error(e);
    }
  });

  conn.ev.on("presence.update", async ({ id, presences }) => {
    try {
      const sender = Object.keys(presences)[0] || id;
      const _sender = conn.decodeJid(sender);
      const presence = presences[sender]?.lastKnownPresence || "composing";

      let chatSender = conn.chats[_sender];
      if (!chatSender) chatSender = conn.chats[_sender] = { id: sender };

      chatSender.presences = presence;

      if (isGroupId(id)) {
        let chatGroup = conn.chats[id];
        if (!chatGroup) chatGroup = conn.chats[id] = { id };
      }
    } catch (e) {
      console.error(e);
    }
  });
}

const KEY_MAP = {
  "pre-key": "preKeys",
  session: "sessions",
  "sender-key": "senderKeys",
  "app-state-sync-key": "appStateSyncKeys",
  "app-state-sync-version": "appStateVersions",
  "sender-key-memory": "senderKeyMemory",
};

function useSingleFileAuthState(filename, logger) {
  let creds;
  let keys = {};
  let saveCount = 0;

  const saveState = (forceSave) => {
    logger?.trace("saving auth state");
    saveCount++;
    if (forceSave || saveCount > 5) {
      writeFileSync(filename, JSON.stringify({ creds, keys }, BufferJSON.replacer, 2));
      saveCount = 0;
    }
  };

  if (existsSync(filename)) {
    const result = JSON.parse(readFileSync(filename, "utf-8"), BufferJSON.reviver);
    creds = result.creds;
    keys = result.keys;
  } else {
    creds = initAuthCreds();
    keys = {};
  }

  return {
    state: {
      creds,
      keys: {
        get: (type, ids) => {
          const key = KEY_MAP[type];
          return ids.reduce((dict, id) => {
            let value = keys[key]?.[id];
            if (value && type === "app-state-sync-key") {
              value = proto.AppStateSyncKeyData.fromObject(value);
            }
            if (value) dict[id] = value;
            return dict;
          }, {});
        },
        set: (data) => {
          for (const _key in data) {
            const key = KEY_MAP[_key];
            keys[key] = keys[key] || {};
            Object.assign(keys[key], data[_key]);
          }
          saveState();
        },
      },
    },
    saveState,
  };
}

function loadMessage(jid, id = null) {
  let message = null;
  if (jid && !id) {
    id = jid;
    const filter = (m) => m.key?.id === id;
    const messages = {};
    const messageFind = Object.entries(messages).find(([, msgs]) => msgs.find(filter));
    message = messageFind?.[1].find(filter);
  } else {
    jid = jid?.decodeJid?.();
    const messages = {};
    if (!(jid in messages)) return null;
    message = messages[jid].find((m) => m.key.id === id);
  }
  return message || null;
}

export default {
  bind,
  useSingleFileAuthState,
  loadMessage,
};
