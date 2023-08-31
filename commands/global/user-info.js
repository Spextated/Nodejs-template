const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Get information about a member in the guild').addUserOption(option => option.setName('member').setDescription('Select a member').setRequired(false)), cooldown: 10, 
    async execute(interaction) {
try {
   let user = interaction.options.getUser('member') || interaction.user;
const member = await interaction.guild.members.fetch(user.id);
const userAvatar = user.displayAvatarURL({ extension: 'png' });
const userBadges = user.flags.toArray().map(badge => badge).join(' ') || 'None';
const botStatus = user.bot ? 'Yes' : 'No';

let roles = [];
let roleCount = 10;
await member._roles.forEach(async (roleID) => {
let role = await interaction.guild.roles.fetch(roleID);
roles.push({
  id: role.id,
  name: role.name,
  position: role.position
  });
});
      
roles = roles.sort((a, b) => b.position - a.position ).map((role) => `> <@&${role.id}>`);
      
if (roles.length >= roleCount) {
roles = roles.slice(0, roleCount);
roles.push(`> and ${member._roles.length - roleCount} more (${member._roles.length} total)`);
}

      
let embed = new EmbedBuilder()
    .setTitle(`${user.username} Information`)
  .addFields({ name: '<:discord_joined_new:1137479865445142712> Joined Discord', value: `> <t:${Math.floor(user.createdAt.getTime() / 1000)}:D>`, inline: true })
  .addFields({ name: '<:discord_joined_new:1137479865445142712> Joined Server', value: `> <t:${Math.floor(member.joinedAt.getTime() / 1000)}:D>`, inline: true })
  .addFields({ name: '<:BotTag:1137479303517438122> Bot', value: `> ${botStatus}`, inline: true })
  .addFields({ name: '📛 Discord Badges', value: `> ${userBadges}`, inline: true })
  .addFields({ name: '<:DiscordServerBoost:1137480185403428975> Boosted Server', value: `> ${member.premiumSince ? 'Yes' : 'No'}`, inline: true })
  .addFields({ name: '<:member_white:1137482286741340210> Roles', value: `${roles.join('\n') || '> None'}`, inline: true })
.setColor(parseInt(member.displayHexColor.replace('#', ''), 16) || 0x000000)
  .setThumbnail(userAvatar)
  .setFooter({ text: `User ID: ${member.id}`, iconURL: userAvatar })
  .setTimestamp();

  await interaction.reply({ embeds: [embed] });
} catch (error) {
  console.log('There was an error with the user-info command: ' + error)
  await interaction.reply({ content: `There was an error with the user-info command. Please try again later!`, ephemeral: true })
}
  },
}