const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward every 24 hours'), cooldown: 0, async execute(interaction) {
    await interaction.deferReply();

    await db.connect();
  let daily = await db.get(`${interaction.user.id}.daily`);
  let balance = await db.get(`${interaction.user.id}.balance`);
   let coins = Math.floor(Math.random() * 5000) + 7500;
    
  let rewardEmbed = new EmbedBuilder()
      .setTitle(`🎁 You have claimed your daily reward of **${coins.toLocaleString()}** coins`)
      .setColor('White');
      
    if (!daily) {
    await db.set(`${interaction.user.id}.daily.time`, Date.now());
      await db.set(`${interaction.user.id}.daily.claimed`, 1);
    if (balance) {
    await db.add(`${interaction.user.id}.balance.coins`, coins)
    await db.close();
    return await interaction.editReply({ embeds: [rewardEmbed] });
    } else {
    await db.set(`${interaction.user.id}.balance.coins`, coins)
    await db.close();
    return await interaction.editReply({ embeds: [rewardEmbed] });
    }
  }
      
  if (Date.now() >= Number(daily.time) + 86400000) {
    await db.add(`${interaction.user.id}.balance.coins`, coins)
    await db.set(`${interaction.user.id}.daily.time`, Date.now());
    await db.add(`${interaction.user.id}.daily.claimed`, 1);
      await db.close();
    return await interaction.editReply({ embeds: [rewardEmbed] });
  } else {
    let timeRemain = parseInt((Number(daily.time) + 86400000) / 1000);
    let timeEmbed = new EmbedBuilder()
      .setTitle(`:x: You can claim your next daily reward <t:${timeRemain}:R>`)
      .setColor('#000000');
      await db.close();
    return await interaction.editReply({ embeds: [timeEmbed] });
  }
  },
}