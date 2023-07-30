const { Events } = require('discord.js');

const Discord = require("discord.js");

const { GatewayIntentBits, EmbedBuilder, Collection, ActivityType, WebhookClient }
= require('discord.js')

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds] });

const  { REST } = require('@discordjs/rest');

const fs = require('fs');

const {
    Routes
} = require('discord-api-types/v9');

const commandFiles = fs
	.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));

let TEST_GUILD_ID;

const commands = [];

client.commands = new Collection();
client.cooldowns = new Collection();
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

module.exports = {
   name: Events.ClientReady,
  once: true, 
  execute(client) {
    
	console.log(`Logged in as ${client.user.tag}`);
    
client.user.setPresence({
  activities: [{ name: `Creating Discord Servers`, type: ActivityType.Playing }],
  status: 'online',
});
    
	const rest = new REST({
		version: '9'
	}).setToken(process.env.TOKEN);
	(async () => {
		try {
			if (!TEST_GUILD_ID) {
				await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
					body: commands
				});
				console.log('Successfully registered application commands globally');
			} else {
				await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID), {
					body: commands
				});
				console.log(
					'Successfully registered application commands for development guild'
				);
			}
		} catch (error) {
			if (error) console.error(error);
		}
	})();
},
}