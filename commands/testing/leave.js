const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Make bot leave specified guild (Bot Developer Only)')
   .addStringOption(option =>
      option.setName('guild-id')
        .setDescription('Provide guild ID to leave')
        .setRequired(true)), cooldown: 0, developer: true,
  async execute(interaction) {
    const guildId = interaction.options.getString('guild-id')

    let guild = interaction.client.guilds.cache.get(guildId);

    if (!guild) {
      return interaction.reply({ content: ':x: Unable to find a guild with that ID', ephemeral: true })
    }

   guild.leave(guildId).then(guild => {
      interaction.reply({ content: `I've left **${guild.name}** (${guildId})`, ephemeral: true })
    }).catch(async error => {
      console.log(`There was an error with the leave command: ` + error);
      await interaction.reply({ content: `There was an error with the leave command: ${error.message}`, ephemeral: true })
    })

  },
}