const { EmbedBuilder, Events, Collection }
= require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {

if (interaction.channel.type === 'DM') return;
    
if (!interaction.isCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
    
	const { cooldowns } = interaction.client;

	if (!cooldowns.has(command)) {
		cooldowns.set(command, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command);
	const cooldownAmount = (command.cooldown || 5) * 1000;
		
	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    
	const timeLeft = (expirationTime - now) / 1000;
		const embed = new EmbedBuilder()
			.setTitle(`:x: Please wait ${timeLeft.toFixed(0)} more second(s) before using the **${command.data.name}** command again!`)
			.setColor('#ffff00');

		if (now < expirationTime) {
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
 },
}