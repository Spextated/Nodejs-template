const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('mine')
  .setDescription('Mine to get diamonds'), cooldown: 300, level: 5, async execute(interaction) {
     await db.connect();
    await interaction.deferReply();
   try {
     let diamonds = Math.floor(Math.random() * 5) + 1;
await db.add(`${interaction.user.id}.balance.diamonds`, diamonds)
       await db.close();
       let embed = new EmbedBuilder()
       .setTitle(`:white_check_mark: You mined and received ${diamonds} 💎`)
       .setColor('White');
       return await interaction.editReply({ embeds: [embed]})
   } catch (error) {
     console.log(`There was an error with the mine command: ${error}`);
   }
 },
}