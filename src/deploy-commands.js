const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { TOKEN, CLIENT_ID, GUILD_ID } = require("../config.js");

async function deploy() {
  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const files = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    const cmd = require(path.join(commandsPath, file));
    commands.push(cmd.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
    body: commands,
  });

  console.log(`✅ Commands deployed: ${commands.length}`);
}

module.exports = { deploy };
