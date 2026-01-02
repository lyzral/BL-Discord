const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { replyEmbed } = require("../handlers/reply");

const ownersPath = path.join(__dirname, "..", "storage", "owners.json");

function readOwners() {
  try {
    return JSON.parse(fs.readFileSync(ownersPath, "utf8"));
  } catch {
    return { ownerIds: [] };
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ownerlist")
    .setDescription("Affiche la liste des owners du bot."),

  async execute(interaction) {
    const data = readOwners();
    const list = data.ownerIds || [];

    if (!list.length) {
      return replyEmbed(interaction, "info", "Aucun owner enregistré.");
    }

    const txt = list.map((id) => `• <@${id}> (\`${id}\`)`).join("\n");
    return replyEmbed(interaction, "info", `**Owners bot :**\n${txt}`);
  },
};
