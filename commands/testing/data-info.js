const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('data-info')
  .setDescription('Get data information about a user (Bot Developer Only)')
  .addStringOption(option => option.setName('user-id').setDescription('Provide a user id').setRequired(false)), cooldown: 0, developer: true, async execute(interaction) {
    await db.connect();
    await interaction.deferReply();

    let user = interaction.options.getString('user-id') || interaction.user.id;
    let userInfo = await db.get(user);
    if (!userInfo) {
      await db.close();
      return await interaction.editReply({ content: `:x: That user doesn't exist in the database`, ephemeral: true })
    }
    return await interaction.editReply({ content: `${JSON.stringify(userInfo)}`});
  },
}