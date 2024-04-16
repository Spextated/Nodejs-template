const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('weekly')
  .setDescription('Claim your weekly reward every week'), cooldown: 0, async execute(interaction) {
    await interaction.deferReply();
    
    await db.connect();
  let weekly = await db.get(`${interaction.user.id}.weekly`);
  let balance = await db.get(`${interaction.user.id}.balance`);
   let coins = Math.floor(Math.random() * 5000) + 20000;
    
  let rewardEmbed = new EmbedBuilder()
      .setTitle(`🎁 You have claimed your weekly reward of **${coins.toLocaleString()}** coins`)
      .setColor('White');
      
    if (!weekly) {
    await db.set(`${interaction.user.id}.weekly.time`, Date.now());
      await db.set(`${interaction.user.id}.weekly.claimed`, 1);
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
      
  if (Date.now() >= Number(weekly.time) + 604800000) {
    await db.add(`${interaction.user.id}.balance.coins`, coins)
    await db.set(`${interaction.user.id}.weekly.time`, Date.now());
    await db.add(`${interaction.user.id}.weekly.claimed`, 1);
      await db.close();
    return await interaction.editReply({ embeds: [rewardEmbed] });
  } else {
    let timeRemain = parseInt((Number(weekly.time) + 604800000) / 1000);
    let timeEmbed = new EmbedBuilder()
      .setTitle(`:x: You can claim your next weekly reward <t:${timeRemain}:R>`)
      .setColor('#000000');
      await db.close();
    return await interaction.editReply({ embeds: [timeEmbed] });
  }
  },
}