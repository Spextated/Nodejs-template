const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('wipe')
  .setDescription('Wipe a users data from database (Bot Developer Only)')
  .addStringOption(option => option.setName('user-id').setDescription('Provide the user id you want to wipe').setRequired(true)), developer: true, cooldown: 0, async execute(interaction) {
    let user = interaction.options.getString('user-id')
      await db.connect();
    await interaction.deferReply();
      let realUser = await interaction.client.users.cache.get(user);
      let data = await db.get(user);
      if (data) {
     await db.delete(user);
        if (!realUser) {
            await db.close();
          return interaction.editReply({ content: `Successfully wiped ${user} data`, ephemeral: true });
        } else {
            await db.close();
          return interaction.editReply({ content: `Successfully wiped ${realUser.username}(${user}) data`, ephemeral: true})
        }
      } else {
          await db.close();
        return interaction.editReply({ content: `Unable to find (${user}) data`, ephemeral: true})
      }
  },
}