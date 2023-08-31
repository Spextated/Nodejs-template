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
	.readdirSync('./commands/global')
	.filter(file => file.endsWith('.js'));

const commandFilesTwo = fs
  .readdirSync('./commands/testing')
	.filter(file => file.endsWith('.js'));

const commands = [];
const commandsTwo = [];

client.commands = new Collection();
client.cooldowns = new Collection();

for (const file of commandFiles) {
	const command = require(`../commands/global/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

for (const file of commandFilesTwo) {
	const command = require(`../commands/testing/${file}`);
	commandsTwo.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

module.exports = {
   name: Events.ClientReady,
  once: true, 
  execute(client) {
    
	console.log(`Logged in as ${client.user.tag}`);
    
client.user.setPresence({
  activities: [{ name: `Soon 👀`, type: ActivityType.Playing }],
  status: 'dnd',
});
const guild = client.guilds.cache.get(process.env.TEST_GUILD_ID)
    
	const rest = new REST({
		version: '9'
	}).setToken(process.env.TOKEN);
	(async () => {
		try {
				await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
					body: commands
				});
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID),
			{ body: commandsTwo },
		);
				console.log(`Successfully registered ${commands.length} application commands globally`);
      console.log(`Successfully registered ${commandsTwo.length} application commands for testing`);
      
		} catch (error) {
			if (error) console.error(error);
		}
	})();
},
}