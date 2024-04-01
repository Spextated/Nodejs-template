const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('upgrade')
  .setDescription('Upgrade an sword or your health')
  .addSubcommand(option => option.setName('list').setDescription('List of available upgrades'))
  .addSubcommand(option => option.setName('buy').setDescription('Buy an upgrade').addIntegerOption(option => option.setName('id').setDescription('What ID number is the upgrade you want to buy?').setRequired(true)).addIntegerOption(option => option.setName('amount').setDescription('How much do you want to upgrade your item or health?').setMinValue(1).setRequired(true))), cooldown: 5, async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
   await db.connect();
    const userData = await db.get(interaction.user.id);
    await interaction.deferReply();
    const upgrades = [{ id: 1, upgrade: '+1 Damage', category: 'damage', description: '+1 damage on your current sword', currency: '🪙', price: 10000 }, { id: 2, upgrade: '+1 Defense', category: 'defense', description: '+1 defense on your armor total', currency: '💎', price: 6 }];
    
    if (subcommand === 'list') {
      let embed = new EmbedBuilder()
    .setTitle('🛠️ Available Upgrades')
      .setColor('White')
      for (let i = 0; i < upgrades.length; i++) {
        embed.addFields({ name: `${upgrades[i].upgrade}`, value: `> ID Number: **${upgrades[i].id}**\n> Description: **${upgrades[i].description}**\n> Price: **${upgrades[i].price.toLocaleString()}** ${upgrades[i].currency}`})
      }
      return await interaction.editReply({ embeds: [embed] });
    }
    if (subcommand === 'buy') {
      const id = interaction.options.getInteger('id');
      const amount = interaction.options.getInteger('amount');
      if (!upgrades[id - 1]) {
        let embed = new EmbedBuilder()
        .setTitle(':x: There is no upgrade with that ID')
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed]})
      }
if (!userData.items.some(item => item.name.includes('⚔️')) && upgrades[id - 1].category === 'damage') {
  let embed = new EmbedBuilder()
  .setTitle(':x: You can not upgrade your damage if you do not have a sword')
  .setColor('#000000');
  return await interaction.editReply({ embeds: [embed]})
}
let index = 0;

for (let i = 0; i < userData.items.length; i++) {
  if (userData.items[i].name.includes('⚔️'))  {
    index = i;
    break;
  }
}
if (upgrades[id - 1].category === 'damage' && userData.items[index].damage == (userData.rank.level * 10) * 2) {
  let embed = new EmbedBuilder()
  .setTitle(':x: You need to level up in order to upgrade your damage further')
  .setColor('#000000');
  return await interaction.editReply({ embeds: [embed]})
}

if (upgrades[id - 1].category === 'defense' && userData.defense == (userData.rank.level * 10)) {
  let embed = new EmbedBuilder()
  .setTitle(':x: You need to level up in order to upgrade your defense further')
  .setColor('#000000');
  return await interaction.editReply({ embeds: [embed]})
}
      
if (upgrades[id - 1].currency === '🪙') {
  if (userData.balance.coins >= (upgrades[id - 1].price * amount) && upgrades[id - 1].category === 'damage') {
  await db.subtract(`${interaction.user.id}.balance.coins`, (upgrades[id - 1].price * amount));
    
await db.add(`${interaction.user.id}.items[${index}].damage`, amount);

    let embed = new EmbedBuilder()
    .setTitle(`✅ Successfully increased the damage of your current sword by **${amount}**`)
    .setColor('White');
    
    return await interaction.editReply({ embeds: [embed]});
} else {
  let embed = new EmbedBuilder()
    .setTitle(':x: You do not have enough coins to complete this purchase')
    .setColor('#000000');
    return await interaction.editReply({ embeds: [embed]});
 }
}
      
if (upgrades[id - 1].currency === '💎') {
  if (userData.balance.diamonds >= (upgrades[id - 1].price * amount) && upgrades[id - 1].category === 'defense') {
  await db.subtract(`${interaction.user.id}.balance.diamonds`, (upgrades[id - 1].price * amount));
    
  await db.add(`${interaction.user.id}.defense`, amount);
  let embed = new EmbedBuilder()
    .setTitle(`✅ Successfully increased your defense by **${amount}**`)
    .setColor('White');
  return await interaction.editReply({ embeds: [embed]})
} else {
    let embed = new EmbedBuilder()
    .setTitle(':x: You do not have enough diamonds to complete this purchase')
    .setColor('#000000');
    return await interaction.editReply({ embeds: [embed]});
}
  } 
}
  }
}