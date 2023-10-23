const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('data-edit')
  .setDescription('Edit users data from the database (Bot Developer Only)')
  .addStringOption(option => option.setName('data').setDescription('Provide the new data').setRequired(true))
  .addStringOption(option => option.setName('user-id').setDescription('Provide a user id').setRequired(true)), cooldown: 0, developer: true, async execute(interaction) {
    await db.connect();
    await interaction.deferReply();

    let user = interaction.options.getString('user-id');
    let newData = interaction.options.getString('data');
    let userInfo = await db.get(user);
    if (!userInfo) {
      await db.close();
      return await interaction.editReply({ content: `:x: That user doesn't exist in the database`, ephemeral: true })
    }
    await db.set(user, JSON.parse(newData));
    return await interaction.editReply({ content: `Successfully set ${user} data to:\n\n${JSON.parse(JSON.stringify(newData))}`, ephemeral: true })
  },
}