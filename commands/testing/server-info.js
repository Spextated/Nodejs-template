const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Information about this server'), cooldown: 10, 
    async execute(interaction) {
await interaction.deferReply();
let link;

if (interaction.guild.vanityURLCode) {
  link = `> :link: https://discord.gg/${interaction.guild.vanityURLCode} with ${interaction.guild.vanityURLUses}`;
} else {
  link = '> :link: None';
}
  
  let embed = new EmbedBuilder()
      .setTitle(`Information about ${interaction.guild.name}`)
  .addFields({ name: 'Server Creation', value: `> <:joined:1137479865445142712> <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:D>`, inline: true })
  .addFields({ name: 'Server Owner', value: `> :crown: <@${interaction.guild.ownerId}>`, inline: true })
    .addFields({ name: `Member Count (${interaction.guild.memberCount})`, value: `> :person_standing: ${interaction.guild.memberCount - interaction.guild.members.cache.filter(member => member.user.bot).size} Humans\n> <:BotTag:1137479303517438122> ${interaction.guild.members.cache.filter(member => member.user.bot).size} Bots`, inline: true })
 .addFields({ name: 'Role Count', value: `> <:roles:1137482286741340210> ${interaction.guild.roles.cache.size} Roles`, inline: true })
  .addFields({ name: `Channel Count (${interaction.guild.channels.cache.size})`, value: `> :speech_balloon: ${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText && ChannelType.GuildForum && ChannelType.GuildNews).size} Text Channels\n> :thread: ${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildPublicThread && ChannelType.GuildPrivateThread && ChannelType.GuildNewsThread).size} Thread Channels\n> :loud_sound: ${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice && ChannelType.GuildStageVoice).size} Voice Channels\n> :dividers: ${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size} Categories`, inline: true })
.addFields({ name: `Emoji Count (${interaction.guild.emojis.cache.size})`, value: `> ⚡️ ${interaction.guild.emojis.cache.filter(emoji => !emoji.animated).size} Static Emojis\n> <a:spinning_star:1137793394442240120> ${interaction.guild.emojis.cache.filter(emoji => emoji.animated).size} Animated Emojis`})
.addFields({ name: `Sticker Count`, value: `> <:sticker_badge:1137790196654538782> ${interaction.guild.stickers.cache.size} Stickers`})
.addFields({ name: `Server Boosts (${interaction.guild.premiumSubscriptionCount})`, value: `> <:DiscordServerBoost:1137480185403428975> Tier: ${interaction.guild.premiumTier || 'None'}\n> :gem: ${interaction.guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size} Boosters`})
.addFields({ name: 'Vanity URL', value: link, inline: true })
.setColor(interaction.guild.members.me.roles.highest.hexColor)
.setThumbnail(interaction.guild.iconURL({ extension: 'png' }))
.setFooter({ text: `Server ID: ${interaction.guild.id}`})
.setTimestamp();

return await interaction.editReply({ embeds: [embed] })
  
  },
}