const { SlashCommandBuilder } = require('discord.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: '../json.sqlite' });

module.exports = {
   data: new SlashCommandBuilder()
   .setName('maintenance')
   .setDescription('Start or end maintenance')
   .addSubcommand(subcommand => subcommand.setName('start').setDescription('Start maintenance on Equinox (Bot Developer Only)')).addSubcommand(subcommand => subcommand.setName('end').setDescription('End maintenance on Equinox (Bot Developer Only)')).addSubcommand(subcommand => subcommand.setName('status').setDescription('Status of the maintenance')), cooldown: 0, developer: true, async execute(interaction) {
     let subcommand = interaction.options.getSubcommand();
  await interaction.deferReply();
    if (subcommand === 'start') {
  await db.set('maintenance', true);
  return await interaction.editReply({ content: 'Maintenance has started on Equinox', ephemeral: true })
  } else if (subcommand === 'end') {
  await db.set('maintenance', false);
  return await interaction.editReply({ content: 'Maintenance has ended on Equinox', ephemeral: true })
  } else if (subcommand === 'status') {
    return await interaction.editReply({ content: `Maintenance: **${await db.get('maintenance')}**`, ephemeral: true })
  }
   },
}