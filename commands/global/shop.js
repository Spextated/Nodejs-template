const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('shop')
  .setDescription('Shop')
  .addSubcommand(subcommand => subcommand.setName('items').setDescription('Lists the available items in the shop'))
  .addSubcommand(subcommand => subcommand.setName('buy').setDescription('Buy an item in the shop').addIntegerOption(option => option.setName('item').setDescription('Provide the item ID you want to buy').setRequired(true)))
  .addSubcommand(subcommand => subcommand.setName('sell').setDescription('Sell an item from your inventory').addIntegerOption(option => option.setName('item').setDescription('Provide the item ID you want to sell').setRequired(true))), cooldown: 5, async execute(interaction) {
     await interaction.deferReply();
    let subcommand = interaction.options.getSubcommand();
    await db.connect();
    let userData = await db.get(interaction.user.id);
    const items = [{id: 1, category: 'pickaxe', item: '⛏Bronze Pickaxe', description: 'Gain 25% more diamonds', price: 100000, level: 5}, {id: 2, category: 'pickaxe', item: '⛏️ Silver Pickaxe', description: 'Gain 50% more diamonds', price: 250000, level: 10}, {id: 3, category: 'pickaxe', item: '⛏️ Gold Pickaxe', description: 'Gain 75% more diamonds', price: 500000, level: 15}, {id: 4, category: 'pickaxe', item: '⛏️ Diamond Pickaxe', description: 'Gain 2x the diamonds', price: 950000, level: 22}, { id: 5, category: 'pickaxe', item: '⛏️ Emerald Pickaxe', description: 'Gain 3x the diamonds', price: 2000000, level: 30}, { id: 6, category: 'swords', item: '⚔️ Upgradable Sword', price: 0, level: 1, damage: 10}];
    if (subcommand === 'items') {
      
      let embed = new EmbedBuilder()
        .setColor('White')
        for (let i = 0; i < items.length; i++) {
          embed.addFields({ name: `${items[i].item}`, value: `> ID Number: **${items[i].id}**\n> Description: **${items[i].description || `This sword has a DPS (Damage Per Second) of ${items[i].damage.toLocaleString()}`}**\n> Level Requirement: **${items[i].level}**\n> Price: **${items[i].price.toLocaleString()}** 🪙`, inline: true })
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
     if (userData.items.some(item => item.name === items[id - 1])) {
       let embed = new EmbedBuilder()
       .setTitle(':x: You already own this item')
       .setColor('#000000');
       return await interaction.editReply({ embeds: [embed] })
     }
    if (userData.items.some(item => item.name.includes('⛏️')) && items[id - 1].category === 'pickaxe') {
      let embed = new EmbedBuilder()
       .setTitle(':x: In order to buy a new pickaxe, you must sell your current pickaxe')
       .setColor('#000000');
       return await interaction.editReply({ embeds: [embed] })
    }
      if (userData.items.some(item => item.name.includes('⚔️')) && items[id - 1].category === 'swords') {
        let embed = new EmbedBuilder()
         .setTitle(':x: In order to buy a new sword, you must sell your current sword')
         .setColor('#000000');
         return await interaction.editReply({ embeds: [embed] })
      }
      
      if (userData.rank.level >= items[id - 1].level) {
        if (userData.balance.coins >= items[id - 1].price) {
          
      let acceptButton = new ButtonBuilder()
        .setCustomId('accept')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Success);

      let declineButton = new ButtonBuilder()
        .setCustomId('decline')
        .setLabel('No')
        .setStyle(ButtonStyle.Danger);

          let row = new ActionRowBuilder()
          .addComponents(acceptButton, declineButton);

          const message = await interaction.editReply({ content: `Are you sure you want to purchase the **${items[id - 1].item}** for **${items[id - 1].price.toLocaleString()}** 🪙?`, components: [row] })

    const collectorFilter = i => i.user.id === interaction.user.id;
          
try {
    const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 120000 });

  if (confirmation.customId === 'accept') {
      let embed = new EmbedBuilder()
      .addFields({ name: `Bought Item`, value: `> ${items[id - 1].item}`, inline: false })
      .addFields({ name: 'Remaining Balance', value: `> ${(userData.balance.coins - items[id - 1].price).toLocaleString()} 🪙`, inline: false })
      .setColor('White')
      .setTimestamp();
    
          await db.subtract(`${interaction.user.id}.balance.coins`, items[id - 1].price);
    if (items[id - 1].category === 'swords') {
      await db.push(`${interaction.user.id}.items`, { name: items[id - 1].item, damage: items[id - 1].damage });
    } 
  if (items[id - 1].category === 'pickaxe') {
await db.push(`${interaction.user.id}.items`, { name: items[id - 1].item });
}
          return await interaction.editReply({ content: '', embeds: [embed], components: []})
  } 
  if (confirmation.customId === 'decline') {
             return await interaction.editReply({ content: `You declined buying the **${items[id-1].item}**`, components: [] });
            }
          } catch (e) {
            return await interaction.editReply({ content: `:x: No response was given. Try the command again!`, components: [] });
    }
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
      
     if (!userData.items.some(item => item.name === items[id - 1].item)) {
       let embed = new EmbedBuilder()
       .setTitle(':x: You can\'t sell an item that you don\'t own')
       .setColor('#000000');
       return await interaction.editReply({ embeds: [embed] })
     }
      if (items[id - 1].item === '⚔️ Upgradable Sword') {
        let embed = new EmbedBuilder()
        .setTitle(':x: This item cannot be sold')
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed] })
      }
      
      let acceptButton = new ButtonBuilder()
        .setCustomId('yes')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Success);

      let declineButton = new ButtonBuilder()
        .setCustomId('no')
        .setLabel('No')
        .setStyle(ButtonStyle.Danger);
      
  let row = new ActionRowBuilder()
    .addComponents(acceptButton, declineButton);

  const message = await interaction.editReply({ content: `Are you sure you want to sell the **${items[id - 1].item}** for **${items[id - 1].price.toLocaleString()}** 🪙?`, components: [row] })

  const collectorFilter = i => i.user.id === interaction.user.id;

      try {
          const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 120000 });

 if (confirmation.customId === 'yes') {
    let embed = new EmbedBuilder()
      .addFields({ name: `Sold Item`, value: `> ${items[id - 1].item}`, inline: false })
      .addFields({ name: 'New Balance', value: `> ${(userData.balance.coins + items[id - 1].price).toLocaleString()} 🪙`, inline: false })
      .setColor('White')
      .setTimestamp();
      
          await db.add(`${interaction.user.id}.balance.coins`, items[id - 1].price);
   
let newArray = userData.items.filter(item => item.name !== items[id - 1].item);
   
   await db.set(`${interaction.user.id}.items`,  newArray);
   
          return await interaction.editReply({ content: '', embeds: [embed], components: [] });
        }
        if (confirmation.customId === 'no') {
        return await interaction.editReply({ content: `You declined selling the **${items[id - 1].item}**`, components: []});
      }
      } catch (e) {
        console.log(e);
        return await interaction.editReply({ content: `:x: No response was given. Try the command again!`, components: [] });
      }
    }
  }
}