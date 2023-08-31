const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, OAuth2Scopes } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Generates a link to invite Equinox to your guild'), cooldown: 60, async execute (interaction) {

try {
const link = interaction.client.generateInvite({
  permissions: [
    PermissionFlagsBits.Administrator,
  ],
  scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
});
    
  let embed = new EmbedBuilder()
    .setDescription(`:link: [Equinox Invite](${link})`)
    .setColor('#000000');
  await interaction.reply({ embeds: [embed] })
} catch (error) {
  console.log('There was an error with the invite command: ' + error)
  await interaction.reply({ content: `There was an error with the invite command. Please try again later!`, ephemeral: true })
}
    
  },
}