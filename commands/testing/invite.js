const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, OAuth2Scopes } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Generates a link to invite Equinox to your guild'), cooldown: 60, async execute (interaction) {
await interaction.deferReply();
const link = interaction.client.generateInvite({
  permissions: [
    PermissionFlagsBits.Administrator,
  ],
  scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
});
    
  let embed = new EmbedBuilder()
    .setDescription(`:link: [Equinox Invite](${link})`)
    .setColor('#000000');
  return await interaction.editReply({ embeds: [embed] })
    
  },
}