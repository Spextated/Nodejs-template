const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo');
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Check out your profile'), cooldown: 0, async execute(interaction) {
    await interaction.deferReply();
  
    await db.connect();
      
      let userInfo = await db.get(`${interaction.user.id}`);
      
      let balEmbed = new EmbedBuilder()
.setTitle(`${interaction.user.username}'s Profile`)
      .setTimestamp()
.setThumbnail(interaction.user.displayAvatarURL({ extension: 'png'}))
      .setColor('#000000');
      
      if (userInfo.balance) {
        balEmbed.addFields({ name: 'Balance', value: `> ${userInfo.balance.coins.toLocaleString() || 0} :coin:\n> ${userInfo.balance.diamonds.toLocaleString() || 0} 💎`, inline: true })
        }
        if (userInfo.bank) {
        balEmbed.addFields({ name: 'Bank Balance', value: `> ${userInfo.bank.coins.toLocaleString() || 0} :coin:`, inline: true })
        }
        if (userInfo.daily) {
        balEmbed.addFields({ name: 'Next Daily Reward', value: `> <t:${parseInt((Number(userInfo.daily.time) + 86400000) / 1000) || 0}:R>`, inline: true })
        balEmbed.addFields({ name: 'Dailies Claimed', value: `> ${userInfo.daily.claimed || 0}`, inline: true })
        }
        if (userInfo.weekly) {
        balEmbed.addFields({ name: 'Next Weekly Reward', value: `> <t:${parseInt((Number(userInfo.weekly.time) + 604800000) / 1000) || 0}:R>`, inline: true })
        balEmbed.addFields({ name: 'Weeklies Claimed', value: `> ${userInfo.weekly.claimed || 0}`, inline: true })
        }
    if (userInfo.health) {
      balEmbed.addFields({ name: 'Health', value: `> ${userInfo.health} ❤️`, inline: true })
    }
    if (userInfo.duels) {
      balEmbed.addFields({ name: '⚔️ Duel Stats', value: `> Wins: ${userInfo.duels.wins || 0}\n> Losses: ${userInfo.duels.losses || 0}`, inline: true });
    }
        if (userInfo.rank) {
          let maxXP = Number(userInfo.rank.level) * 100;
        balEmbed.addFields({ name: 'Rank', value: `> Level ${userInfo.rank.level || 1} (${userInfo.rank.xp || 0}/${maxXP} XP)`, inline: true })
        }
       await db.close();
      return await interaction.editReply({ embeds: [balEmbed] });
  },
} 