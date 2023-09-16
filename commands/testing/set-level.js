const { SlashCommandBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('set-level')
  .setDescription('Set a users level')
  .addIntegerOption(option => option.setName('amount').setDescription('What level should be given?').setRequired(true)).addStringOption(option => option.setName('user').setDescription('Who do you want to set the level to?')), developer: true, cooldown: 0, async execute(interaction) {
    let amount = interaction.options.getInteger('amount')
    let user = interaction.options.getString('user') || interaction.user.id;
     await db.connect();
    let userInfo = await db.get(`${user}.rank.level`);
    await interaction.deferReply();
    try {
    if (!userInfo) {
      await db.close();
      return await interaction.editReply({ content: `Unable to find that user in the database`, ephemeral: true})
    }
    await db.set(`${user}.rank.level`, amount);
    await db.close();
    return await interaction.editReply({ content: `Successfully set ${interaction.user.username}'s level to **${amount.toLocaleString()}**`, ephemeral: true });
    } catch (error) {
      console.log(`There was an error with the set-level command: ${error}`)
      return await interaction.editReply({ content: `There was an error with the set-level command: ${error.message}`, ephemeral: true });
    }
  },
}