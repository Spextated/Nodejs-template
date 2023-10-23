const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Information about Equinox'), cooldown: 10, 
    async execute(interaction) {

        //Ping
        const startTime = Date.now();
        const reply = await interaction.reply('Calculating Equinox\'s ping...');
        const endTime = Date.now();
        const ping = endTime - startTime;

         // Uptime
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);

        const commandCount = interaction.client.commands.size; // Command Count
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Memory Usage
        const cpuUsage = process.cpuUsage().user / 1000000; // CPU Usage
      
        const embed = new EmbedBuilder()
            .setColor('White')
            .addFields(
                { name: 'Uptime', value: `> ${uptimeString}`, inline: true },
                { name: `Equinox's Ping`, value: `> ${ping}ms`, inline: true },
 { name: 'Command Count', value: `> ${commandCount}`, inline: true }, { name: 'Guild Count', value: `> ${interaction.client.guilds.cache.size}`, inline: true }, { name: 'Member Count', value: `> ${interaction.client.users.cache.size}`, inline: true },
    { name: 'Memory Usage', value: `> ${memoryUsage.toFixed(2)} MB`, inline: true },
      { name: 'CPU Usage', value: `> ${cpuUsage.toFixed(2)}%`, inline: true })
.setThumbnail(interaction.client.user.avatarURL({ extension: 'png' }));

  await reply.edit({ content: '', embeds: [embed] });     
    },
}

// Uptime Abbreviation
function formatUptime(uptime) {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
