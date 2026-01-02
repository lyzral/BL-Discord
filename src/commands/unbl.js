const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { replyEmbed } = require("../handlers/reply");

const blPath = path.join(__dirname, "..", "storage", "blacklist.json");

function readBL() {
  try {
    return JSON.parse(fs.readFileSync(blPath, "utf8"));
  } catch {
    return { userIds: [] };
  }
}

function writeBL(data) {
  fs.writeFileSync(blPath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unbl")
    .setDescription("Retire un membre de la BL (retire + unban).")
    .addStringOption((opt) =>
      opt.setName("userid").setDescription("ID du membre").setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.options.getString("userid", true);

    const me = interaction.guild.members.me;
    if (!me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return replyEmbed(interaction, "err", "Je n’ai pas la permission **Bannir des membres**.");
    }

    const data = readBL();
    data.userIds = (data.userIds || []).filter((id) => id !== userId);
    writeBL(data);

    // Unban (si banni)
    try {
      await interaction.guild.members.unban(userId);
    } catch {
      // ok si pas banni
    }

    return replyEmbed(
      interaction,
      "ok",
      `ID \`${userId}\` retiré de la **blacklist**.`
    );
  },
};
