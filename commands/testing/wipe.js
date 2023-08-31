const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('wipe')
  .setDescription('Wipe a users data from database (Bot Developer Only)')
  .addStringOption(option => option.setName('user-id').setDescription('Provide the user id you want to wipe').setRequired(true)), developer: true, cooldown: 0, async execute(interaction) {
    let user = interaction.options.getString('user-id')
    try {
      await db.connect();
      let realUser = await interaction.client.users.cache.get(user);
      let data = await db.get(user);
      if (data) {
     await db.delete(user);
        if (!realUser) {
            await db.close();
          return interaction.reply({ content: `Successfully wiped ${user} data`, ephemeral: true });
        } else {
            await db.close();
          return interaction.reply({ content: `Successfully wiped ${realUser.username}(${user}) data`, ephemeral: true})
        }
      } else {
          await db.close();
        return interaction.reply({ content: `Unable to find (${user}) data`, ephemeral: true})
      }
    } catch (error) {
      console.log(`There was an error with the wipe command: ${error}`)
      return interaction.reply({ content: `There was an error with the wipe command. Please try again later!`, ephemeral: true });
    }
  },
}