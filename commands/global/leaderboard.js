const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey)

module.exports = {
  data: new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Leaderboard')
  .addSubcommand(subcommand => subcommand.setName('global').setDescription('Get the global leaderboard').addStringOption(option => option.setName('category').setDescription('Pick a category to get a leaderboard of').addChoices({ name: 'Coins', value: 'coins' }, { name: 'Bank Coins', value: 'Bank-Coins' }, { name: 'Level', value: 'level' }, { name: 'Diamonds', value: 'diamonds'}).setRequired(true)))
  .addSubcommand(subcommand => subcommand.setName('server').setDescription('Get the server leaderboard').addStringOption(option => option.setName('category').setDescription('Pick a category to get a leaderboard of').addChoices({ name: 'Coins', value: 'coins' }, { name: 'Bank Coins', value: 'Bank-Coins' }, { name: 'Level', value: 'level' }, { name: 'Diamonds', value: 'diamonds'}).setRequired(true))), cooldown: 0, async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    await db.connect();
    if (subcommand === 'global') {
       let category = interaction.options.getString('category');
      if (category === 'coins') {
const arr = [];
      const users = await interaction.client.users.cache.map(u => u.id);
      users.forEach(u => {
       arr.push(u)
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i]);
const realUser = await interaction.client.users.fetch(arr[i]);
if (realUser.bot) continue;

    mes.push({
      name: realUser.tag,
      coins: data?.balance.coins || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.coins - a.coins)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].coins.toLocaleString()}** 🪙`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.user.tag;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Global Coins Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    if (category === 'Bank-Coins') {
const arr = [];
   const users = await interaction.client.users.cache.map(u => u.id);
      users.forEach(u => {
       arr.push(u)
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i]);
const realUser = await interaction.client.users.fetch(arr[i]);
if (realUser.bot) continue;
let bank = await db.get(`${arr[i]}.bank.coins`);
    if (!bank) continue;
    mes.push({
      name: realUser.tag,
      coins: data.bank.coins || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.coins - a.coins)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].coins.toLocaleString()}** 🪙`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.user.tag;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Global Bank Coins Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    if (category === 'level') {
        const arr = [];
   const users = await interaction.client.users.cache.map(u => u.id);
      users.forEach(u => {
       arr.push(u)
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i]);
const realUser = await interaction.client.users.fetch(arr[i]);
if (realUser.bot) continue;

    mes.push({
      name: realUser.tag,
      level: data?.rank.level || 0,
      xp: data?.rank.xp || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.coins - a.coins || b.xp - a.xp)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].level.toLocaleString()}**`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.user.tag;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Global Level Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    if (category === 'diamonds') {
        const arr = [];
   const users = await interaction.client.users.cache.map(u => u.id);
      users.forEach(u => {
       arr.push(u)
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i]);
const realUser = await interaction.client.users.fetch(arr[i]);
if (realUser.bot) continue;

    mes.push({
      name: realUser.tag,
      diamonds: data?.balance.diamonds || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.diamonds - a.diamonds)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].diamonds.toLocaleString()}** 💎`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.user.tag;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Global Diamonds Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    }
    if (subcommand === 'server') {
      let category = interaction.options.getString('category');
      if (category === 'coins') {
const arr = [];
await interaction.guild.members.fetch().then(member => {
  member.forEach(members => {
    arr.push(members)
})
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i].id);

if (arr[i].user.bot) continue;

    mes.push({
      name: arr[i].displayName,
      coins: data?.balance.coins || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.coins - a.coins)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].coins.toLocaleString()}** 🪙`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.member.displayName;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Coins Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    if (category === 'Bank-Coins') {
const arr = [];
await interaction.guild.members.fetch().then(member => {
  member.forEach(members => {
    arr.push(members)
})
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i].id);

if (arr[i].user.bot) continue;

    mes.push({
      name: arr[i].displayName,
      coins: data?.bank.coins || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.coins - a.coins)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].coins.toLocaleString()}** 🪙`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.member.displayName;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Bank Coins Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    if (category === 'level') {
        const arr = [];
await interaction.guild.members.fetch().then(member => {
  member.forEach(members => {
    arr.push(members)
})
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i].id);

if (arr[i].user.bot) continue;

    mes.push({
      name: arr[i].displayName,
      level: data?.rank.level || 0,
      xp: data?.rank.xp || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.coins - a.coins || b.xp - a.xp)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].level.toLocaleString()}**`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.member.displayName;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Level Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    if (category === 'diamonds') {
        const arr = [];
await interaction.guild.members.fetch().then(member => {
  member.forEach(members => {
    arr.push(members)
})
    })

  let allmem = arr.length
  let people = 0;
  let peopleToShow = 10;

  let mes = [];

  for (let i = 0; i < allmem; i++) {
   
  let data = await db.get(arr[i].id);

if (arr[i].user.bot) continue;

    mes.push({
      name: arr[i].displayName,
      diamonds: data?.balance.diamonds || 0,
    })
  }
const realarr = [];
      
mes.sort((a, b) => b.diamonds - a.diamonds)
          
for (let k = 0; k < mes.length; k++) {
  people++
  
if (people > peopleToShow) continue;
  
  realarr.push(`${k + 1}) **${mes[k].name}** - **${mes[k].diamonds.toLocaleString()}** 💎`)
}

  let finalLb = realarr.join('\n')
  let userReal = a => a.name === interaction.member.displayName;
 let userRank = mes.findIndex(userReal) + 1;
  let embed = new EmbedBuilder()
.setTitle(`Diamonds Leaderboard`)
      .setDescription(finalLb)
      .setFooter({ text: `Your Leaderboard Position is #${userRank.toLocaleString()}`})
      .setColor('#2F3136');
      return await interaction.editReply({ embeds: [embed]});
      }
    }
  },
}