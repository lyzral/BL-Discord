const { EmbedBuilder } = require("discord.js");

function buildEmbed(type, text) {
  const meta = {
    ok: { emoji: "✅", color: 0x57f287 },
    warn: { emoji: "⚠️", color: 0xfee75c },
    err: { emoji: "❌", color: 0xed4245 },
    info: { emoji: "ℹ️", color: 0x5865f2 },
  };

  const m = meta[type] || meta.info;

  return new EmbedBuilder()
    .setColor(m.color)
    .setDescription(`${m.emoji} ${text}`);
}

async function replyEmbed(interaction, type, text, ephemeral = true) {
  const embed = buildEmbed(type, text);

  if (interaction.replied || interaction.deferred) {
    return interaction.followUp({ embeds: [embed], ephemeral });
  }
  return interaction.reply({ embeds: [embed], ephemeral });
}

module.exports = { replyEmbed, buildEmbed };
