const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('mine')
  .setDescription('Mine to get diamonds'), cooldown: 180, async execute(interaction) {
     await db.connect();
    await interaction.deferReply();
    let userData = await db.get(interaction.user.id);
   
     let diamonds = 8;
     if (userData.items.some(item => item.name === '⛏️ Bronze Pickaxe')) {
      diamonds = diamonds + 2
    }
    if (userData.items.some(item => item.name === '⛏️ Silver Pickaxe')) {
      diamonds = diamonds + 4;
    }
     if (userData.items.some(item => item.name === '⛏️ Gold Pickaxe')) {
      diamonds = diamonds + 6;
    }
     if (userData.items.some(item => item.name === '⛏️ Diamond Pickaxe')) {
      diamonds = diamonds * 2;
    }
     if (userData.items.some(item => item.name === '⛏️ Emerald Pickaxe')) {
      diamonds = diamonds * 3;
    }
    
await db.add(`${interaction.user.id}.balance.diamonds`, diamonds)
       await db.close();
       let embed = new EmbedBuilder()
       .setTitle(`⛏️ You mined and received **${diamonds}** 💎`)
       .setColor('White');
       return await interaction.editReply({ embeds: [embed]})
 },
}