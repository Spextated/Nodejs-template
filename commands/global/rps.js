const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('rps')
  .setDescription('Play Rock-Paper-Scissors for a reward')
  .addStringOption(option => option.setName('choice').setDescription('Pick between Rock, Paper, or Scissors').addChoices({ name: 'Rock', value: 'rock' }, { name: 'Paper', value: 'paper' }, { name: 'Scissors', value: 'scissors' }).setRequired(true)), cooldown: 30, async execute(interaction) {
    const choice = interaction.options.getString('choice');
    await interaction.deferReply();
    
      await db.connect();
      
    let coins = Math.floor(Math.random() * 500) + 1500;
    const responses = ['scissors', 'rock', 'paper'];
      const computer = responses[Math.floor(Math.random() * responses.length)];
      
      let winEmbed = new EmbedBuilder()
    .setTitle(`:partying_face: You chose ${choice} and I chose ${computer}. You won ${coins.toLocaleString()} coins!`)
    .setColor('White');
    let drawEmbed = new EmbedBuilder()
      .setTitle(`:heavy_equals_sign: You chose ${choice} and I chose ${computer}. We drew, so you didn't lose any coins!`)
      .setColor('White');
  if (choice === computer) {
    await db.close();
    return await interaction.editReply({ embeds: [drawEmbed] })
    } else if (choice === 'scissors' && computer === 'paper' || choice === 'paper' && computer === 'rock' || choice === 'rock' && computer === 'scissors') {
      await db.add(`${interaction.user.id}.balance.coins`, coins)
    await db.close();
    return await interaction.editReply({ embeds: [winEmbed] });
    } else {
    let loseEmbed = new EmbedBuilder()
    .setTitle(`:cry: You chose ${choice} and I chose ${computer}. You lost ${coins.toLocaleString()} coins. Better luck next time!`)
    .setColor('#000000');
    await db.subtract(`${interaction.user.id}.balance.coins`, coins);
      await db.close();
    return await interaction.editReply({ embeds: [loseEmbed] });
    }
  },
}