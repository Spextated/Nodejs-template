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
const { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } = require('mongodb-snapshot');
const EventEmitter = require('events');
const database = new EventEmitter();
module.exports = database;

const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

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

const databaseFiles = fs.readdirSync('./database').filter(file => file.endsWith('.js'));

for (const file of databaseFiles) {
  const event = require(`./database/${file}`);
  if (event.once) {
    database.once(event.name, (...args) => event.execute(...args));
  } else {
    database.on(event.name, (...args) => event.execute(...args));
  }
}

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
	const command = require(`./commands/global/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

for (const file of commandFilesTwo) {
	const command = require(`./commands/testing/${file}`);
	commandsTwo.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

async function dumpMongo2Localfile() {
    const mongo_connector = new MongoDBDuplexConnector({
        connection: {
            uri: 'mongodb+srv://munewerkiar:AucMfXraXotSrFdM@cluster0.qzcm14c.mongodb.net/',
            dbname: 'Cluster0',
        },
    });

    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
            path: './backup.tar',
        },
    });

    const transferer = new MongoTransferer({
        source: mongo_connector,
        targets: [localfile_connector],
    });

    for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
    }
}

dumpMongo2Localfile();

process.on('unhandledRejection', error => {});
process.on('uncaughtException', (err) => {})
process.on('uncaughtExceptionMonitor', (err, origin) => {})

db.on("ready", () => {
    console.log("Connected to the database");
});

client.login(process.env.TOKEN);

