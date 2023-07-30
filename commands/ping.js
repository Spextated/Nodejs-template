const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bots ping'), cooldown: 10,
    async execute(interaction) {
  const sent = await interaction.reply({ content: 'Calculating...', fetchReply: true });
interaction.editReply(`Bots Ping: **${sent.createdTimestamp - interaction.createdTimestamp}ms**`)
    }
};