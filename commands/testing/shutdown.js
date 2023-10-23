const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('shutdown')
  .setDescription('Shutdown Equinox'),
  developer: true, cooldown: 0, 
  async execute(interaction) {
    await interaction.editReply();
      return await interaction.editReply({ content: 'Equinox has sucessfully shutdown', ephemeral: true })
      process.exit();
  }, 
}