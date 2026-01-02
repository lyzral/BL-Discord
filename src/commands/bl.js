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
    .setName("bl")
    .setDescription("Blacklist un membre (ajoute à la BL + ban).")
    .addUserOption((opt) =>
      opt.setName("membre").setDescription("Le membre à blacklist").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("raison").setDescription("Raison du ban").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("membre", true);
    const reason = interaction.options.getString("raison") || "Blacklisted";

    const me = interaction.guild.members.me;
    if (!me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return replyEmbed(interaction, "err", "Je n’ai pas la permission **Bannir des membres**.");
    }

    const data = readBL();
    if (!data.userIds.includes(target.id)) {
      data.userIds.push(target.id);
      writeBL(data);
    }

    // Check role hierarchy when the user is still in the guild
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (member) {
      if (me.roles.highest.position <= member.roles.highest.position) {
        return replyEmbed(
          interaction,
          "err",
          "Je ne peux pas le ban : son rôle est **au-dessus / égal** au mien (hiérarchie)."
        );
      }
    }

    // Ban
    try {
      await interaction.guild.members.ban(target.id, { reason });
      return replyEmbed(interaction, "ok", `${target.tag} est **blacklist** et **banni**.`);
    } catch (e) {
      return replyEmbed(
        interaction,
        "err",
        `Ban impossible. Raison: \`${e?.message || "erreur inconnue"}\``
      );
    }
  },
};
