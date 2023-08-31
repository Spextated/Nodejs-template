const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo');
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Check out your profile'), cooldown: 0, async execute(interaction) {
    try {
    await db.connect();
      
      let userInfo = await db.get(`${interaction.user.id}`);
      let maxXP = Number(userInfo.rank.level) * 100;
      let balEmbed = new EmbedBuilder()
.setTitle(`${interaction.user.username}'s Profile`)
        .setDescription(`Balance: ${userInfo.balance.coins || 0} :coin:\nNext Daily: <t:${parseInt((Number(userInfo.daily) + 86400000) / 1000) || 0}:R>\nDailies claimed: ${userInfo.claimed || 0}\nLevel: ${userInfo.rank.level || 1} (${userInfo.rank.xp || 0}/${maxXP} XP)`)
      .setColor('#000000');
      
     await db.close();
      
      return interaction.reply({ embeds: [balEmbed] });
    } catch (error) {
      console.log('There was an error with the balance command: ' + error)
      return interaction.reply({ content: `There was an error with the balance command. Please try again later!`, ephemeral: true });
    }
  },
} 