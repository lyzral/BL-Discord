const { Client, GatewayIntentBits, Collection, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { TOKEN, SYS_ID } = require("../config.js");
const { deploy } = require("./deploy-commands.js");
const { isAllowed } = require("./handlers/guard.js");
const { replyEmbed } = require("./handlers/reply.js");

const blacklistPath = path.join(__dirname, "storage", "blacklist.json");

function readBlacklist() {
  try {
    const raw = fs.readFileSync(blacklistPath, "utf8");
    const json = JSON.parse(raw);
    return Array.isArray(json.userIds) ? json.userIds : [];
  } catch {
    return [];
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, "commands");
const files = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));
for (const file of files) {
  const cmd = require(path.join(commandsPath, file));
  client.commands.set(cmd.data.name, cmd);
}

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Deploy commands on startup
  try {
    await deploy();
  } catch (e) {
    console.error("❌ Deploy error:", e);
  }
});

// Auto-ban blacklisted users on join
client.on("guildMemberAdd", async (member) => {
  try {
    const bl = readBlacklist();
    if (!bl.includes(member.id)) return;

    const me = member.guild.members.me;
    if (!me || !me.permissions.has(PermissionFlagsBits.BanMembers)) return;

    await member.ban({ reason: "Blacklisted" });
  } catch (e) {
    console.error("Auto BL ban error:", e);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Restrict every command to SYS + owners
  if (!isAllowed(interaction.user.id, SYS_ID)) {
    return replyEmbed(interaction, "err", "Tu n’as pas la permission.", true);
  }

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client);
  } catch (e) {
    console.error(e);

    await replyEmbed(interaction, "err", "Erreur pendant l’exécution.", true);
  }
});

client.login(TOKEN);
