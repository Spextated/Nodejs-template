const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: '../json.sqlite' });
const axios = require('axios');
module.exports = {
   data: new SlashCommandBuilder()
   .setName('blacklist')
   .setDescription('Blacklist users & servers from using Equinox')
   .addSubcommand(subcommand => subcommand.setName('user').setDescription('Blacklist a user from using Equinox (Bot Developer Only)').addStringOption(option => option.setName('user-id').setDescription('Provide the user-id you want to blacklist from using Equinox').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Provide why the user was blacklisted').setRequired(false))).addSubcommand(subcommand => subcommand.setName('guild').setDescription('Blacklist a guild from using Equinox (Bot Developer Only)').addStringOption(option => option.setName('guild-id').setDescription('Provide the guild-id you want to blacklist from using Equinox').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Provide why the guild was blacklisted').setRequired(false))).addSubcommand(subcommand => subcommand.setName('list').setDescription('Lists all the users & guilds that are blacklisted (Bot Developer Only)')), cooldown: 0, developer: true, async execute(interaction) {
     let subcommand = interaction.options.getSubcommand();
     await interaction.deferReply();
     let date = new Date(Date.now())
if (subcommand === 'user') {

  let id = interaction.options.getString('user-id');
  let reason = interaction.options.getString('reason') || 'No reason was provided';
  let banned_users = await db.get('blacklisted-users') || [];
  let user = interaction.client.users.cache.get(id);
  if (!user) {
    return await interaction.editReply({ content: ':x: Unable to find a user with that ID', ephemeral: true })
  }
  if (banned_users.includes(id)) {
    return await interaction.editReply({ content: ':x: The user provided is already blacklisted', ephemeral: true })
  }
  await db.push('blacklisted-users', id)
  await axios.post(process.env.SheetsAPI_Users, {
      data: {
        Username: `${user.username}`,
        UserID: `${user.id}`,
        Reason: `${reason}`,
        Date: date.toString()
      }
  })
  return await interaction.editReply({ content: `${user.username} (${user.id}) has been blacklisted from using Equinox`, ephemeral: true });

} else if (subcommand === 'guild') {
  
    let guildId = interaction.options.getString('guild-id');
    let reason = interaction.options.getString('reason') || 'No reason was provided';
    let banned_guilds = await db.get('blacklisted-guilds') || [];
    let guild = interaction.client.guilds.cache.get(guildId);
    if (!guild) {
      return await interaction.editReply({ content: ':x: Unable to find a guild with that ID', ephemeral: true })
    }
if (banned_guilds.includes(guildId)) {
    return await interaction.editReply({ content: ':x: The guild provided is already blacklisted', ephemeral: true })
  }
  await db.push('blacklisted-guilds', guildId)
await axios.post(process.env.SheetsAPI_Guilds, {
      data: {
      GuildName: `${guild.name}`,
      GuildID: `${guild.id}`,
        Reason: `${reason}`,
        Date: date.toString()
      }
    })
    return await interaction.editReply({ content: `${guild.name} (${guild.id}) has been blacklisted from using Equinox`, ephemeral: true })

} else if (subcommand === 'list') {

    let banned_users = await axios.get(process.env.SheetsAPI_Users)
    let banned_guilds = await axios.get(process.env.SheetsAPI_Guilds)
    let arr1 = [];
    let arr2 = [];
    for (let i = 0; i < banned_users.data.length; i++) {
    let data = banned_users.data[i];
    arr1.push(`User ID: ${data.UserID}`)
    }
    for (let i = 0; i < banned_guilds.data.length; i++) {
    let data = banned_guilds.data[i];
    arr2.push(`Guild ID: ${data.GuildID}`)
    }
    let finalArr1 = arr1.join('\n');
    let finalArr2 = arr2.join('\n');
    let embed = new EmbedBuilder()
    .setTitle('Blacklisted Users & Guilds')
    .addFields({ name: 'Users', value: `${finalArr1 || 'No users to display'}`, inline: false })
    .addFields({ name: 'Guilds', value: `${finalArr2 || 'No guilds to display'}`, inline: false })
    .setTimestamp();
    return await interaction.editReply({ embeds: [embed], ephemeral: true });

}
     
  },
}