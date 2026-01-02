const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { SYS_ID } = require("../../config.js");
const { replyEmbed } = require("../handlers/reply");

const ownersPath = path.join(__dirname, "..", "storage", "owners.json");

function readOwners() {
  try {
    return JSON.parse(fs.readFileSync(ownersPath, "utf8"));
  } catch {
    return { ownerIds: [] };
  }
}

function writeOwners(data) {
  fs.writeFileSync(ownersPath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unowner")
    .setDescription("Retire un owner du bot (SYS seulement).")
    .addUserOption((opt) =>
      opt.setName("membre").setDescription("Membre à retirer").setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== SYS_ID) {
      return replyEmbed(interaction, "err", "Commande réservée au **SYS**.");
    }

    const target = interaction.options.getUser("membre", true);
    const data = readOwners();

    data.ownerIds = (data.ownerIds || []).filter((id) => id !== target.id);
    writeOwners(data);

    return replyEmbed(interaction, "ok", `${target.tag} n’est plus **owner bot**.`);
  },
};
