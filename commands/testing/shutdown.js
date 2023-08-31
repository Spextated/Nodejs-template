const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('shutdown')
  .setDescription('Shutdown Equinox'),
  developer: true, cooldown: 0, 
  async execute(interaction) {
    try {
      await interaction.reply({ content: 'Equinox has sucessfully shutdown', ephemeral: true })
      process.exit();
    } catch (error) {
      console.log('There was an error with the shutdown command: ' + error)
      await interaction.reply({ content: `There was an error with the shutdown command: ${error.message}`, ephemeral: true });
    }
  }, 
}