const { EmbedBuilder, Events, Collection }
= require('discord.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "../json.sqlite" });
const { Database } = require('quickmongo')
const dbTwo = new Database(process.env.mongoKey);

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
  
let maintenance = await db.get('maintenance') || false;
let banned_user = await db.get('blacklisted-users') || [];
let banned_server = await db.get('blacklisted-guilds') || [];

await dbTwo.connect();
let userData = await dbTwo.get(interaction.user.id);
    
if (interaction.channel.type === 'DM') return;
    
if (!interaction.isCommand()) return;

if (banned_user.includes(interaction.user.id) && interaction.user.id != '415178463138545664') {
  return interaction.reply({ content: ':x: You are blacklisted from using Equinox', ephemeral: true });
}
    
if (banned_server.includes(interaction.guild.id) && interaction.user.id != '415178463138545664') {
  return interaction.reply({ content: ':x: This server has been blacklisted from using Equinox', ephemeral: true })
}
    
if (maintenance && interaction.options._subcommand !== 'end' && interaction.user.id != '415178463138545664') {
  return interaction.reply({ content: ':x: Equinox is currently under maintenance. Check back later.'})
}
    
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

if (command.developer) {
  if (interaction.user.id !== '415178463138545664') {
      return interaction.reply({ content: `:x: Only Bot Developers are allowed to use this command`, ephemeral: true });
    }
}

if (interaction.commandName != "bot-info" || interaction.commandName != "server-info" || interaction.commandName != "user-info" || interaction.commandName != "wipe") {
  if (!userData) {
  await dbTwo.set(`${interaction.user.id}.rank`,{ level: 1, xp: 0 })
  } else {
    
  let xp = Math.floor(Math.random() * 20) + 5;
  let nextLevel = userData.rank.level * 100;
  if (userData.rank.xp + xp >= nextLevel) {
    await dbTwo.add(`${interaction.user.id}.rank.level`, 1)
    await dbTwo.set(`${interaction.user.id}.rank.xp`, (userData.rank.xp + xp) - nextLevel);
  } else {
    await dbTwo.add(`${interaction.user.id}.rank.xp`, xp);
  }
    
}
  await dbTwo.close();
}
    
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
 },
}