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
await interaction.deferReply();
    let guild = interaction.client.guilds.cache.get(guildId);

    if (!guild) {
      return await interaction.editReply({ content: ':x: Unable to find a guild with that ID', ephemeral: true })
    }

   guild.leave(guildId).then(async guild => {
      return await interaction.editReply({ content: `I've left **${guild.name}** (${guildId})`, ephemeral: true })
    })
  },
}