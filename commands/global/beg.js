const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('beg')
  .setDescription('Have a chance of getting an reward by begging'), cooldown: 45, async execute(interaction) {
    try {
      await db.connect();
      let balance = await db.get(`${interaction.user.id}.balance.coins`);
      let coins = Math.floor(Math.random() * 1500) + 1000;
      let chance = Math.floor(Math.random() * 100) + 1;
      if (chance > 25) {
        let winEmbed = new EmbedBuilder()
        .setTitle(`🙏 You begged and recieved ${coins} coins`)
        .setColor('White');
      if (balance) {
        await db.add(`${interaction.user.id}.balance.coins`, coins);
          await db.close();
        return interaction.reply({ embeds: [winEmbed] });
        } else {
          await db.set(`${interaction.user.id}.balance.coins`, coins);
          await db.close();
        return interaction.reply({ embeds: [winEmbed] });
        }
      } else if (coins < 25) {
        let loseEmbed = new EmbedBuilder()
        .setTitle(`:cry: Your begging didn't work and you recieved no coins`)
        .setColor('#000000');
          await db.close();
        return interaction.reply({ embeds: [loseEmbed] });
      }
    } catch (error) {
      console.log(`There was an error with the beg command: ${error}`);
      return interaction.reply({ content: `There was an error with the beg command. Please try again later!`})
    }
  }, 
}