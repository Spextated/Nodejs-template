const { SlashCommandBuilder } = require('discord.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: '../json.sqlite' });

module.exports = {
   data: new SlashCommandBuilder()
   .setName('maintenance')
   .setDescription('Start or end maintenance')
   .addSubcommand(subcommand => subcommand.setName('start').setDescription('Start maintenance on Equinox (Bot Developer Only)')).addSubcommand(subcommand => subcommand.setName('end').setDescription('End maintenance on Equinox (Bot Developer Only)')), cooldown: 0, developer: true, async execute(interaction) {
     let subcommand = interaction.options.getSubcommand();
  
    if (subcommand === 'start') {
     try {
  await db.set('maintenance', true);
  await interaction.reply({ content: 'Maintenance has started on Equinox', ephemeral: true })
     } catch (error) {
       console.log('There was an error with the maintenance start command: ' + error.message)
       await interaction.reply({ content: `There was an error with the maintenance start command: ${error.message}`, ephemeral: true });
     }
  } else if (subcommand === 'end') {
       try {
  await db.set('maintenance', false);
  await interaction.reply({ content: 'Maintenance has ended on Equinox', ephemeral: true })
     } catch (error) {
       console.log('There was an error with the maintenance end command: ' + error)
       await interaction.reply({ content: `There was an error with the maintenance end command: ${error.message}`, ephemeral: true });
     }
  }
   },
}