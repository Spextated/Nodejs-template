const { SlashCommandBuilder } = require('discord.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: '../json.sqlite' });
const axios = require('axios');

module.exports = {
   data: new SlashCommandBuilder()
   .setName('whitelist')
   .setDescription('Whitelist users & guilds from using Equinox')
   .addSubcommand(subcommand => subcommand.setName('user').setDescription('Whitelist a user from using Equinox').addStringOption(option => option.setName('user-id').setDescription('Provide the user-id you want to whitelist from using Equinox').setRequired(true))).addSubcommand(subcommand => subcommand.setName('guild').setDescription('Whitelist a guild from using Equinox').addStringOption(option => option.setName('guild-id').setDescription('Provide the guild-id you want to whitelist from using Equinox').setRequired(true))), cooldown: 0, developer: true, async execute(interaction) {
     let subcommand = interaction.options.getSubcommand();

if (subcommand === 'user') {
try {
  let id = interaction.options.getString('user-id');
  let user = interaction.client.users.cache.get(id);
  let database = await db.get('blacklisted-users') || [];
  if (!database.includes(id)) {
    return interaction.reply({ content: ':x: Unable to find that user in the database', ephemeral: true })
  }
  await db.pull('blacklisted-users', id)
  await axios.delete(`${process.env.SheetsAPI_Users}/UserID/${user.id}`)
  await interaction.reply({ content: `${user.username} (${user.id}) has been allowed to use Equinox again`, ephemeral: true });
  } catch (error) {
    console.log('There was an error with the whitelist user command: ' + error.message)
    await interaction.reply({ content: `There was an error with the whitelist user command: ${error.message}`});
  }
} else if (subcommand === 'guild') {
  try {
    let guildId = interaction.options.getString('guild-id');
    let guild = await interaction.client.guilds.cache.get(guildId);
    let database = await db.get('blacklisted-guilds') || [];
  if (!database.includes(guildId)) {
      return interaction.reply({ content: ':x: Unable to find that guild in the database', ephemeral: true })
    }
  await db.pull('blacklisted-guilds', guildId)
    await axios.delete(`${process.env.SheetsAPI_Guilds}/GuildID/${guild.id}`)
    await interaction.reply({ content: `${guild.name} (${guild.id}) has been allowed to use Equinox again`, ephemeral: true })
  } catch (error) {
    console.log('There was an error with the whitelist server command: ' + error)
    await interaction.reply({ content: `There was an error with the whitelist server command: ${error.message}`});
  }
}
     
  },
}