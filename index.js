const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () =>
	console.log(`App listening at http://localhost:${port}`)
);

//----------------------------------//

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const {
	Client,
	GatewayIntentBits,
	Partials,
	PermissionsBitField,
	EmbedBuilder,
	Collection,
	GuildMemberManager,
	AttachmentBuilder,
  PermissionFlagsBits
} = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel]
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
const commandFiles = fs
	.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
const commands = [];

client.commands = new Collection();
client.cooldowns = new Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

process.on('unhandledRejection', error => {
console.error('Unhandled promise rejection: ', error);
});
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception: ', err);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('Uncaught Exception Monitor: ', err, origin);
})

client.login(process.env.TOKEN);

