const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey);
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
  .setName('duel')
  .setDescription('Duel a member of this server for coins')
  .addUserOption(option => option.setName('user').setDescription('Who do you want to duel?').setRequired(true)).addIntegerOption(option => option.setName('wager').setDescription('How much do you want to wager?').setMinValue(5000).setMaxValue(500000).setRequired(true)), async execute(interaction) {
    
    const player = interaction.options.getMember('user');
    const wager = interaction.options.getInteger('wager');
    await interaction.deferReply();
    await db.connect();
    
    const userData = await db.get(interaction.user.id);
    if (player === null) {
      let embed = new EmbedBuilder()
      .setTitle(':x: Your opponent must be a member of this server')
      .setColor('#000000');
      return await interaction.editReply({ embeds: [embed]});
    }
    const playerData = await db.get(player.user.id);
    if (player.user === interaction.user) {
      let embed = new EmbedBuilder()
      .setTitle(':x: You can not duel yourself')
      .setColor('#000000');
      return await interaction.editReply({ embeds: [embed]});
    }
if (player.user.bot) {
  let embed = new EmbedBuilder()
  .setTitle(':x: You can not duel a bot')
  .setColor('#000000');
  return await interaction.editReply({ embeds: [embed]});
}
    if (!playerData) {
      let embed = new EmbedBuilder()
      .setTitle(':x: We have no data of your opponent. They have to run any of our commands to register them!')
      .setColor('#000000');
      return await interaction.editReply({ embeds: [embed]});
    }
    if (!userData.items.some(item => item.name.includes('⚔️'))) {
      let embed = new EmbedBuilder()
      .setTitle(':x: You do not have a sword to fight with')
      .setColor('#000000');
      return await interaction.editReply({ embeds: [embed]});
    }
    if (!playerData.items.some(item => item.name.includes('⚔️'))) {
      let embed = new EmbedBuilder()
      .setTitle(':x: Your opponent does not have a sword to fight with')
      .setColor('#000000');
      return await interaction.editReply({ embeds: [embed]});
    }
  if (wager > userData.balance.coins) {
      let embed = new EmbedBuilder()
    .setTitle(':x: You do not have enough coins to wager that amount')
    .setColor('#000000');
    return await interaction.editReply({ embeds: [embed]});
    }
    
    if (wager > playerData.balance.coins) {
      let embed = new EmbedBuilder()
      .setTitle(':x: Your opponent doesn\'t have enough coins to fulfill the wager')
      .setColor('#000000');
      return await interaction.editReply({ embeds: [embed]});
    }
    
    let userSword = "";
    let userDamage = "";
    let playerSword = "";
    let playerDamage = "";

    for (let i = 0; i < userData.items.length; i++) {
if (userData.items[i].name.includes('⚔️')) {
      userSword = userData.items[i].name;
      userDamage = userData.items[i].damage;
        break;
      }
}

    for (let i = 0; i < playerData.items.length; i++) {
    if (playerData.items[i].name.includes('⚔️')) {
          playerSword = playerData.items[i].name;
          playerDamage = playerData.items[i].damage;
            break;
    }
}
    
    let acceptButton = new ButtonBuilder()
    .setCustomId('accept')
    .setLabel('Accept')
    .setStyle(ButtonStyle.Success);
    
    let declineButton = new ButtonBuilder()
    .setCustomId('decline')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger);

    let row = new ActionRowBuilder()
    .addComponents(acceptButton, declineButton);
    
  const message = await interaction.editReply({ content: `${player}, ${interaction.user} would like to duel you for **${wager}** coins. Would you like to accept or decline the duel?`, components: [row] })

    const collectorFilter = i => i.user.id === player.id;
    try {
      const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 120000 });

      if (confirmation.customId === 'accept') {
      let embed = new EmbedBuilder()
      .setTitle('⚔️ Duel request has been accepted')
        .addFields({ name: `**${interaction.user.username}**`, value: `> 🗡️ Sword: ${userSword} with a DPS of ${userDamage}\n> ❤️ Health: ${userData.health}\n> 🥇 Wins: ${userData.duels.wins || 0}\n> 🥈 Losses: ${userData.duels.losses || 0}` })
        .addFields({ name: `**${player.user.username}**`, value: `> 🗡️ Sword: ${playerSword} with a DPS of ${playerDamage}\n> ❤️ Health: ${playerData.health}\n> 🥇 Wins: ${playerData.duels.wins || 0}\n> 🥈 Losses: ${playerData.duels.losses || 0}`})
      .setFooter({ text: `Wager for ${wager} coins`})
        .setTimestamp();
        
  await interaction.editReply({ content: '', embeds: [embed], components: [] });

await wait(5000);
        
if ((parseInt(playerData.health / userDamage) + 1) > (parseInt(userData.health / playerDamage) + 1)) {
  let embed1 = new EmbedBuilder()
  .setTitle(`⚔️ **${player.user.tag}** has won the duel in ${parseInt(userData.health / playerDamage) + 1} second(s)!`)
  .setColor('White');

  await db.subtract(`${interaction.user.id}.balance.coins`, wager);
await db.add(`${player.user.id}.balance.coins`, wager);
await db.add(`${player.user.id}.duels.wins`, 1);
  await db.add(`${interaction.user.id}.duels.losses`, 1);
  
  return await interaction.editReply({ embeds: [embed1] });
}

if ((parseInt(playerData.health / userDamage) + 1) < (parseInt(userData.health / playerDamage) + 1)) {
          let embed2 = new EmbedBuilder()
          .setTitle(`⚔️ **${interaction.user.tag}** has won the duel in ${parseInt(playerData.health / userDamage) + 1} second(s)!`)
          .setColor('White');

  await db.subtract(`${player.user.id}.balance.coins`, wager);
  await db.add(`${interaction.user.id}.balance.coins`, wager);
  await db.add(`${interaction.user.id}.duels.wins`, 1);
  await db.add(`${player.user.id}.duels.losses`, 1);
  
          return await interaction.editReply({ embeds: [embed2] });
}

        if ((parseInt(playerData.health / userDamage) + 1) == (parseInt(userData.health / playerDamage) + 1)) {
          let embed3 = new EmbedBuilder()
          .setTitle(`⚔️ Both players won the duel in ${parseInt(playerData.health / userDamage) + 1} second(s). Duel ends in a draw!`)
          .setColor('#000000');
          return await interaction.editReply({ embeds: [embed3] });
        }   
      } else if (confirmation.customId === 'decline') {
       return await interaction.editReply({ content: `😢 ${player} has declined your duel request`, components: [] });
      }
    } catch (e) {
      return await interaction.editReply({ content: `😢  ${player} didn\'t respond to your request in time`, components: [] });
    }
  },
}