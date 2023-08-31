const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward every 24 hours'), cooldown: 0, async execute(interaction) {
    try {
    await db.connect();
  let daily = await db.get(`${interaction.user.id}.daily`);
  let balance = await db.get(`${interaction.user.id}.balance`);
   let coins = Math.floor(Math.random() * 15000) + 10000;
    
  let rewardEmbed = new EmbedBuilder()
      .setTitle(`:white_check_mark: You have claimed your daily reward of ${coins} coins`)
      .setColor('White');
      
    if (!daily) {
    await db.set(`${interaction.user.id}.daily`, Date.now());
      await db.set(`${interaction.user.id}.claimed`, 1);
    if (balance) {
    await db.add(`${interaction.user.id}.balance.coins`, coins)
    await db.close();
    return interaction.reply({ embeds: [rewardEmbed] });
    } else {
    await db.set(`${interaction.user.id}.balance.coins`, coins)
    await db.close();
    return interaction.reply({ embeds: [rewardEmbed] });
    }
  }
      
  if (Date.now() >= Number(daily) + 86400000) {
    await db.add(`${interaction.user.id}.balance.coins`, coins)
    await db.set(`${interaction.user.id}.daily`, Date.now());
    await db.add(`${interaction.user.id}.claimed`, 1);
      await db.close();
    return interaction.reply({ embeds: [rewardEmbed] });
  } else {
    let timeRemain = parseInt((Number(daily) + 86400000) / 1000);
    let timeEmbed = new EmbedBuilder()
      .setTitle(`:x: You can claim your next daily reward <t:${timeRemain}:R>`)
      .setColor('Red');
      await db.close();
    return interaction.reply({ embeds: [timeEmbed] });
  }
    } catch (error) {
      console.log('There was an error with the daily command: ' + error);
      return interaction.reply({ content: `There was an error with the daily command. Please try again later!`, ephemeral: true });
    }
  },
}