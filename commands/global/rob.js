const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('rob')
  .setDescription('Rob coins from a member')
  .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)), cooldown: 0, level: 15, async execute(interaction) {
    await db.connect();
    await interaction.deferReply();
    
    let target = interaction.options.getUser('user');
    let targetBalance = await db.get(`${target.id}.balance`);

let amount = parseInt(0.05 * targetBalance);
let chance = Math.floor(Math.random() * 4) + 1;

  if (!interaction.guild.members.cache.get(target.id)) {
      let embed = new EmbedBuilder()
      .setTitle(':x: The user must be a member of this server')
      .setColor('#000000');
      await db.close();
      return await interaction.editReply({ embeds: [embed]})
    }
    if (target.id === interaction.user.id) {
      let embed = new EmbedBuilder()
      .setTitle(':x: You are not allowed to rob yourself')
      .setColor('#000000');
      await db.close();
      return await interaction.editReply({ embeds: [embed] })
    }
  if (target.bot) {
    let embed = new EmbedBuilder()
      .setTitle(':x: You are allowed to rob a bot')
      .setColor('#000000');
    await db.close();
      return await interaction.editReply({ embeds: [embed]})
  }
  if (!targetBalance) {
    let embed = new EmbedBuilder()
      .setTitle(':x: That user does not have a balance')
      .setColor('#000000');
    await db.close();
      return await interaction.editReply({ embeds: [embed]})
  }
  if (targetBalance.coins === 0) {
    let embed = new EmbedBuilder()
      .setTitle(':x: That user doesn\'t have enough coins to be robbed')
      .setColor('#000000');
    await db.close();
      return await interaction.editReply({ embeds: [embed]})
  }
  if (chance > 2) {
    let embed = new EmbedBuilder()
    .setTitle(`😢 You were unsuccessful in robbing ${target}`)
    .setColor('#000000');
    await db.close();
      return await interaction.editReply({ embeds: [embed]})
  }
  let embed = new EmbedBuilder()
  .setTitle(`💰 You have robbed **${amount}** coins from ${target} balance`)
  .setColor('White');
  await db.add(`${interaction.user.id}.balance.coins`, amount)
  await db.subtract(`${target.id}.balance.coins`, amount)
  return await interaction.editReply({ embeds: [embed]})
  },
}