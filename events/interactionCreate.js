const { EmbedBuilder, Events, Collection, WebhookClient }
= require('discord.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "../json.sqlite" });
const { Database } = require('quickmongo')
const dbTwo = new Database(process.env.mongoKey);
const ms = require('enhanced-ms');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {

const webhookClient = new WebhookClient({ id: process.env.webhookID2, token: process.env.webhookToken2 });

const webhookClient2 = new WebhookClient({ id: process.env.webhookID3, token: process.env.webhookToken3 });
    
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
    
	const timeLeft = (expirationTime - now);
		const embed = new EmbedBuilder()
			.setTitle(`:x: Please wait **${ms(timeLeft)}** before using the **${command.data.name}** command again!`)
			.setColor('#2F3136');

		if (now < expirationTime) {
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

if (command.developer) {
  if (interaction.user.id !== '415178463138545664') {
      return await interaction.editReply({ content: `:x: Only Bot Developers are allowed to use this command`, ephemeral: true });
    }
}
if (command.level) {
  if (userData.rank.level < command.level) {
  let embed = new EmbedBuilder()
  .setTitle(`:x: You need to be level **${command.level}** to use this command`)
  return await interaction.editReply({ embeds: [embed] })
 }
}
    
if (interaction.commandName != "bot-info" || interaction.commandName != "server-info" || interaction.commandName != "user-info" || interaction.commandName != "wipe" || interaction.commandName != "data-edit" || interaction.commandName != "data-info") {
  if (!userData) {
  await dbTwo.set(`${interaction.user.id}.rank`,{ level: 1, xp: 0 });
    await dbTwo.set(`${interaction.user.id}.balance`, { coins: 0, diamonds: 0 });
    await dbTwo.set(`${interaction.user.id}.items`, []);
    
let embed = new EmbedBuilder()
.setTitle('New Player Data')
.addFields({ name: 'Player Tag', value: interaction.user.tag, inline: false })
.addFields({ name: 'Player ID', value: interaction.user.id, inline: false })
.addFields({ name: 'Guild ID', value: interaction.guild.id, inline: false })
.addFields({ name: 'Data Creation Date', value: `<t:${parseInt(Date.now() / 1000)}:F>`, inline: false })
.addFields({ name: 'Data', value: `\`${JSON.stringify(await dbTwo.get(interaction.user.id))}\``, inline: false })
  .setColor('#2F3136')
  .setFooter({ text: `${await dbTwo.count()} Total Players` })
    .setTimestamp();
    
  await webhookClient2.send({
	content: '',
	username: 'Equinox',
	avatarURL: 'https://i.imgur.com/or0Oxrv.jpg',
	embeds: [embed],
}).catch(error => console.log(error));
    
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
let embed = new EmbedBuilder()
    .setTitle(`:x: There was an error with the ${interaction.commandName} command`)   .setDescription(`\`${error.stack}\``)
  .setColor('#2F3136')
    .setTimestamp();
    
  await webhookClient.send({
	content: '',
	username: 'Equinox',
	avatarURL: 'https://i.imgur.com/or0Oxrv.jpg',
	embeds: [embed],
}).catch(error => console.log(error));

    return await interaction.editReply({ content: `:x: There was an error with the ${interaction.commandName} command. Please try again later!`, ephemeral: true });
	}
 },
}