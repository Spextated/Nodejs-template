const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update')
    .setDescription('Update a specific command (Bot Developer Only)')
    .addSubcommand(subcommand => subcommand.setName('global').setDescription('Update a command under the global folder (Bot Developer Only)').addStringOption(option =>
option.setName('command').setDescription('The command to update').setRequired(true))).addSubcommand(subcommand => subcommand.setName('testing').setDescription('Update a command under the testing folder (Bot Developer Only)').addStringOption(option =>
option.setName('command').setDescription('The command to update').setRequired(true))), cooldown: 0, developer: true,
  async execute(interaction) {
   const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    if (subcommand === 'global') {
    const commandName = interaction.options.getString('command', true).toLowerCase();

    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return await interaction.editReply({ content: `:x: Unable to find a command with the name \`${commandName}\``, ephemeral: true });
    }

    delete require.cache[require.resolve(`../global/${command.data.name}.js`)];
     interaction.client.commands.delete(command.data.name);
      const newCommand = require(`../global/${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      return await interaction.editReply({ content: `\`${newCommand.data.name}\` was updated`, ephemeral: true });
  } 
    if (subcommand === 'testing') {
      const commandName = interaction.options.getString('command', true).toLowerCase();

    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return await interaction.editReply({ content: `:x: Unable to find a command with the name \`${commandName}\``, ephemeral: true });
    }

    delete require.cache[require.resolve(`./${command.data.name}.js`)];
      interaction.client.commands.delete(command.data.name);
      const newCommand = require(`./${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      return await interaction.editReply({ content: `\`${newCommand.data.name}\` was updated`, ephemeral: true });
    }
  },
};