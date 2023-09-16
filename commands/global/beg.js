const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('beg')
  .setDescription('Have a chance of getting an reward by begging'), cooldown: 45, async execute(interaction) {
    await db.connect();
    await interaction.deferReply();
    try {
      let coins = Math.floor(Math.random() * 1500) + 1000;
      let chance = Math.floor(Math.random() * 100) + 1;
      if (chance > 25) {
        let winEmbed = new EmbedBuilder()
        .setTitle(`🙏 You begged and recieved ${coins.toLocaleString()} coins`)
        .setColor('White');
await db.add(`${interaction.user.id}.balance.coins`, coins);
          await db.close();
        return await interaction.editReply({ embeds: [winEmbed] });
      } else {
        let loseEmbed = new EmbedBuilder()
        .setTitle(`:cry: Your begging didn't work and you recieved no coins`)
        .setColor('#000000');
          await db.close();
        return await interaction.editReply({ embeds: [loseEmbed] });
      }
    } catch (error) {
      console.log(`There was an error with the beg command: ${error}`);
      return await interaction.editReply({ content: `There was an error with the beg command. Please try again later!`})
    }
  }, 
}