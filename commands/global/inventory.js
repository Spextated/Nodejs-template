const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js')
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('Check out what items you have in your inventory'), cooldown: 10, async execute(interaction) {
    await db.connect();
    await interaction.deferReply();
    const inventory = await db.get(`${interaction.user.id}.items`);
      if (inventory.length === 0) {
        let embed = new EmbedBuilder()
        .setTitle(':x: You do not have any items in your inventory. Check out the shop to get some items.')
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed]});
      }
      let embed = new EmbedBuilder()
      .setColor('White')
      for (let i = 0; i < inventory.length; i++) {
      if (inventory[i].damage) {
    embed.addFields({ name: `Item #${i + 1}`, value: `> ${inventory[i].name} - ${inventory[i].damage} DPS`})
        continue;
        }
        embed.addFields({ name: `Item #${i + 1}`, value: `> ${inventory[i].name}`})
      }
      await db.close();
      return await interaction.editReply({ embeds: [embed]});
  }, 
}