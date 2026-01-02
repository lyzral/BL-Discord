# 🚫 BL — Discord Blacklist & Owner Management Bot

BL is a **private Discord moderation bot** built with **discord.js v14**.  
It provides a simple **blacklist system** (ban + persistent blacklist) and a **bot owner system**, with **all commands restricted to SYS and bot owners only**.

> ⚠️ Important: Discord does **not** allow true “IP bans” or guaranteed “ban all alts”.  
> This bot blacklists **user IDs** and bans those accounts. If a user joins with a different account, you’ll need extra anti-alt measures (verification, account-age rules, anti-raid, etc.).

---

## ✨ Features

- 🚫 Blacklist system (persistent JSON)
- 🔨 `/bl` → Adds to blacklist and bans the member
- ♻️ `/unbl` → Removes from blacklist and unbans the user (if banned)
- 👑 Bot owner management (SYS-only)
- 🔒 Global slash-command restriction (**SYS / Owners only**)
- 💾 Local JSON storage (no database required)
- 🎨 Clean embed replies for every command (✅ / ⚠️ / ❌ style)

---

## 🧩 Commands Overview

### `/bl <member> [reason]`
Blacklists a member and **bans** them from the server.

- Adds the user ID to `storage/blacklist.json`
- Attempts to ban the user
- Shows a clear embed error if banning fails (permissions / role hierarchy / etc.)

---

### `/unbl <userid>`
Removes a user ID from the blacklist and attempts to unban.

- Removes the ID from `storage/blacklist.json`
- Attempts to unban the user (safe if they aren’t banned)

---

## 👑 Owner Commands

> **SYS only**

- `/owner <user>` → Add a bot owner  
- `/unowner <user>` → Remove a bot owner  
- `/ownerlist` → Display the current owner list  

Owners are stored in `storage/owners.json`.

---

## 🔐 Permissions & Security

- **All slash commands are restricted**
- Only:
  - SYS (defined in `config.js`)
  - Bot owners (stored in `storage/owners.json`)

Unauthorized users automatically receive a **permission denied** embed.

---

## 🧠 Privileged Intent (Required)

If you use auto-actions that rely on member events (like `guildMemberAdd`), you must enable:

- ✅ **SERVER MEMBERS INTENT**

In the **Discord Developer Portal**:
1. Application → **Bot**
2. **Privileged Gateway Intents**
3. Enable **SERVER MEMBERS INTENT**
4. Save & restart the bot

If you don’t enable it, you may see: **“Used disallowed intents”**.

---

## 🗂 Project Structure

```txt
BL/
├── src/
│   ├── commands/
│   │   ├── bl.js
│   │   ├── unbl.js
│   │   ├── owner.js
│   │   ├── unowner.js
│   │   └── ownerlist.js
│   ├── handlers/
│   │   ├── guard.js
│   │   └── reply.js
│   ├── storage/
│   │   ├── blacklist.json
│   │   └── owners.json
│   ├── deploy-commands.js
│   └── index.js
├── config.js
├── package.json
└── README.md
```

---

## ⚙️ Requirements

- Node.js **v18+**
- discord.js **v14**
- A Discord bot application
- Recommended: **Administrator permission** (or at least Ban Members + required role hierarchy)

---

## 📦 Installation

Inside the project folder:

```bash
npm install
```

---

## 🔧 Configuration

Edit `config.js`:

```js
module.exports = {
  TOKEN: "BOT_TOKEN",
  CLIENT_ID: "CLIENT_ID",
  GUILD_ID: "GUILD_ID",
  SYS_ID: "YOUR_DISCORD_ID"
};
```

⚠️ **Never share your bot token.**

---

## ▶️ Running the Bot

### Development
```bash
node src/index.js
```

### Production (recommended)
```bash
pm2 start src/index.js --name BL
pm2 save
pm2 logs BL
```

---

## 💾 Data Storage

The bot stores data locally:

- `src/storage/blacklist.json` → blacklisted user IDs
- `src/storage/owners.json` → bot owner IDs

No external database required.

---

## ✅ Notes / Common Issues

### “/bl doesn’t ban”
Check:
- The bot role has **Ban Members**
- The bot role is **higher** than the target’s highest role
- The target isn’t server owner / higher admin role

### “Used disallowed intents”
Enable **SERVER MEMBERS INTENT** in the Developer Portal (see section above).

---

## 📜 License

Private / internal usage only.  
Redistribution or resale without permission is prohibited.
