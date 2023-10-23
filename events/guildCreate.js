const { EmbedBuilder, Events, WebhookClient }
= require('discord.js')

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {

if (!guild.available) return;
    
const webhookClient = new WebhookClient({ id: process.env.webhookID, token: process.env.webhookToken });
    
const owner = await guild.fetchOwner();
    
const embed = new EmbedBuilder()
	.setTitle(`Successfully joined **${guild.name}'s** Guild`)
  .addFields({ name: 'Guild Owner', value: `${owner.user.tag}`, inline: true }, { name: 'Guild Owner ID', value: `${guild.ownerId}`, inline: true }, { name: 'Guild Member Count', value: `${guild.memberCount}`, inline: true }, { name: 'Joined At', value: `<t:${parseInt(guild.joinedAt / 1000)}>`, inline: true })
  .setThumbnail(`${guild.iconURL()}`)
  .setFooter({ text: `Currently in ${guild.client.guilds.cache.size} server(s)`})
  .setColor('#2F3136')
  .setTimestamp();

await webhookClient.send({
	content: '',
	username: 'Equinox',
	avatarURL: 'https://i.imgur.com/or0Oxrv.jpg',
	embeds: [embed],
}).catch(error => console.log(error));
  }
}