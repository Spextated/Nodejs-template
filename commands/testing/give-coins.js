const { SlashCommandBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('give-coins')
  .setDescription('Give coins to a user')
  .addIntegerOption(option => option.setName('amount').setDescription('Amount of coins to give').setRequired(true)).addStringOption(option => option.setName('user').setDescription('Who do you want to give coins to?')), developer: true, cooldown: 0, async execute(interaction) {
    let amount = interaction.options.getInteger('amount')
    let user = interaction.options.getString('user') || interaction.user.id;
     await db.connect();
    let userInfo = await db.get(`${user}.balance`);
    await interaction.deferReply();
    try {
    if (!userInfo) {
      return await interaction.editReply({ content: `Unable to find that user in the database`, ephemeral: true})
    }
    await db.add(`${user}.balance.coins`, amount);
    await db.close();
    return await interaction.editReply({ content: `Successfully gave ${interaction.user.username} **${amount.toLocaleString()}** coins`, ephemeral: true });
    } catch (error) {
      console.log(`There was an error with the give-coins command: ${error}`)
      return await interaction.editReply({ content: `There was an error with the give-coins command: ${error.message}`, ephemeral: true });
    }
  },
}