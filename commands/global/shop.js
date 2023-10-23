const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('shop')
  .setDescription('Shop')
  .addSubcommand(subcommand => subcommand.setName('items').setDescription('Lists the available items in the shop'))
  .addSubcommand(subcommand => subcommand.setName('buy').setDescription('Buy an item in the shop').addIntegerOption(option => option.setName('item').setDescription('Provide the item ID you want to buy').setRequired(true)))
  .addSubcommand(subcommand => subcommand.setName('sell').setDescription('Sell an item from your inventory').addIntegerOption(option => option.setName('item').setDescription('Provide the item ID you want to sell').setRequired(true))), cooldown: 5, async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    await db.connect();
    await interaction.deferReply();
    let userData = await db.get(interaction.user.id);
    const items = [{id: 1, item: '⛏Bronze Pickaxe', description: 'Gain 25% more diamonds', price: 50000, level: 5}, {id: 2, item: '⛏️ Silver Pickaxe', description: 'Gain 50% more diamonds', price: 100000, level: 10}, {id: 3, item: '⛏️ Gold Pickaxe', description: 'Gain 75% more diamonds', price: 250000, level: 20}, {id: 4, item: '⛏️ Diamond Pickaxe', description: 'Gain 2x the diamonds', price: 1000000, level: 45}, { id: 5, item: '⛏️ Emerald Pickaxe', description: 'Gain 3x the diamonds', price: 2000000, level: 75 }];
    if (subcommand === 'items') {
      
      let embed = new EmbedBuilder()
        .setColor('White')
        for (let i = 0; i < items.length; i++) {
          embed.addFields({ name: `${items[i].item}`, value: `> ID Number: **${items[i].id}**\n> Description: **${items[i].description || 'No description provided'}**\n> Level Requirement: **${items[i].level}**\n> Price: **${items[i].price.toLocaleString()}** 🪙`, inline: true })
        }
        return await interaction.editReply({ embeds: [embed] })

    }
    if (subcommand === 'buy') {
      let id = interaction.options.getInteger('item');
      
      if (!items[id - 1]) {
        let embed = new EmbedBuilder()
        .setTitle(`:x: That ID does not exist`)
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed] })
      }
     if (userData.items.includes(items[id - 1].item)) {
       let embed = new EmbedBuilder()
       .setTitle(':x: You already own this item')
       .setColor('#000000');
       return await interaction.editReply({ embeds: [embed] })
     }
    if (userData.items.some(item => item.includes('⛏️')) && id <= 5) {
      let embed = new EmbedBuilder()
       .setTitle(':x: In order to buy a new pickaxe, you must sell your current pickaxe')
       .setColor('#000000');
       return await interaction.editReply({ embeds: [embed] })
    }
      if (userData.rank.level >= items[id - 1].level) {
        if (userData.balance.coins >= items[id - 1].price) {
      let embed = new EmbedBuilder()
      .addFields({ name: `Bought Item`, value: `> ${items[id - 1].item}`, inline: false })
      .addFields({ name: 'Remaining Balance', value: `> ${(userData.balance.coins - items[id - 1].price).toLocaleString()} 🪙`, inline: false })
      .setColor('White')
      .setTimestamp();
          await db.subtract(`${interaction.user.id}.balance.coins`, items[id - 1].price);
          await db.push(`${interaction.user.id}.items`, items[id - 1].item);
          return await interaction.editReply({ embeds: [embed]})
        } else {
        let embed = new EmbedBuilder()
          .setTitle(`:x: You are unable to purchase this item`)
          .setColor('#000000');
          return await interaction.editReply({ embeds: [embed] });
        }
      } else {
        let embed = new EmbedBuilder()
        .setTitle(`:x: You do not meet the level requirement`)
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed] });
      }
    }
    if (subcommand === 'sell') {
      let id = interaction.options.getInteger('item');
      
        if (!items[id - 1]) {
        let embed = new EmbedBuilder()
        .setTitle(`:x: That ID does not exist`)
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed] })
      }
     if (!userData.items.includes(items[id - 1].item)) {
       let embed = new EmbedBuilder()
       .setTitle(':x: You can\'t sell an item that you don\'t own')
       .setColor('#000000');
       return await interaction.editReply({ embeds: [embed] })
     }
    let embed = new EmbedBuilder()
      .addFields({ name: `Sold Item`, value: `> ${items[id - 1].item}`, inline: false })
      .addFields({ name: 'New Balance', value: `> ${(userData.balance.coins + items[id - 1].price).toLocaleString()} 🪙`, inline: false })
      .setColor('White')
      .setTimestamp();
          await db.add(`${interaction.user.id}.balance.coins`, items[id - 1].price);
          await db.pull(`${interaction.user.id}.items`, items[id - 1].item);
          return await interaction.editReply({ embeds: [embed]})
    }
  }
}