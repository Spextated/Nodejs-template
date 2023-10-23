const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('mine')
  .setDescription('Mine to get diamonds'), cooldown: 180, level: 5, async execute(interaction) {
     await db.connect();
    await interaction.deferReply();
    let userData = await db.get(interaction.user.id);
   
     let diamonds = Math.floor(Math.random() * 8) + 1;
     if (userData.items.includes('⛏️ Bronze Pickaxe')) {
      diamonds = diamonds + 2
    }
    if (userData.items.includes('⛏️ Silver Pickaxe')) {
      diamonds = diamonds + 4;
    }
     if (userData.items.includes('⛏️ Gold Pickaxe')) {
      diamonds = diamonds + 6;
    }
     if (userData.items.includes('⛏️ Diamond Pickaxe')) {
      diamonds = diamonds * 2;
    }
     if (userData.items.includes('⛏️ Emerald Pickaxe')) {
      diamonds = diamonds * 3;
    }
await db.add(`${interaction.user.id}.balance.diamonds`, diamonds)
       await db.close();
       let embed = new EmbedBuilder()
       .setTitle(`⛏️ You mined and received ${diamonds} 💎`)
       .setColor('White');
       return await interaction.editReply({ embeds: [embed]})
 },
}