const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo');
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('bank')
  .setDescription('Put your coins in a safe place').addSubcommand(subcommand => subcommand.setName('open').setDescription('Open a bank account')).addSubcommand(subcommand => subcommand.setName('close').setDescription('Close your bank account')).addSubcommand(subcommand => subcommand.setName('deposit').setDescription('Deposit coins into your bank account').addIntegerOption(option => option.setName('amount').setDescription('How much do you want to deposit?').setRequired(true))).addSubcommand(subcommand => subcommand.setName('withdraw').setDescription('Withdraw coins from your bank account').addIntegerOption(option => option.setName('amount').setDescription('How much do you want to withdraw?').setRequired(true))), cooldown: 10, async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    await db.connect();
    await interaction.deferReply();
      let userInfo = await db.get(`${interaction.user.id}`);
    
    if (subcommand === 'open') {
      if (userInfo.bank) {
        let openedBank = new EmbedBuilder()
  .setTitle(`:x: You already have a bank account open`)
  .setColor('#000000');
   await db.close();
  return interaction.editReply({ embeds: [openedBank]});
      }
if (userInfo.balance.coins < 150000) {
  let failBank = new EmbedBuilder()
  .setTitle(`:x: You need **${150000 - Number(userInfo.balance.coins)}** more coins to open a bank account`)
  .setColor('#000000');
   await db.close();
  return interaction.editReply({ embeds: [failBank]});
} else {
  await db.subtract(`${interaction.user.id}.balance.coins`, 150000);
  await db.set(`${interaction.user.id}.bank.coins`, 0);
  let success = new EmbedBuilder()
  .setTitle(':white_check_mark: You have successfully opened a bank account')
  .setColor('White');
     await db.close();
      return interaction.editReply({ embeds: [success] });
}
  } else if (subcommand === 'close') {
if (userInfo.bank === undefined) {
  let failBank = new EmbedBuilder()
  .setTitle(`:x: You don't have an opened bank account to close`)
  .setColor('#000000');
   await db.close();
  return interaction.editReply({ embeds: [failBank]});
} else {
  await db.add(`${interaction.user.id}.balance.coins`, 150000 + Number(userInfo.bank.coins));
  await db.delete(`${interaction.user.id}.bank`);
  let success = new EmbedBuilder()
  .setTitle(':white_check_mark: You have successfully closed your bank account! (150,000 coins will be returned to you as well as leftover coins in the bank)')
  .setColor('#000000');
     await db.close();
      return interaction.editReply({ embeds: [success] });
}
  } else if (subcommand === 'deposit') {
      let amount = interaction.options.getInteger('amount');
    if (userInfo.bank) {
      if (amount > userInfo.balance.coins) {
        let failCoin = new EmbedBuilder()
        .setTitle(':x: You do not have that amount of coins to deposit into your bank account')
        .setColor('#000000');
        await db.close();
        return interaction.editReply({ embeds: [failCoin] });
      }
          let success = new EmbedBuilder()
          .setTitle(`:white_check_mark: Successfully deposited **${amount.toLocaleString()}** coins into your bank account`)
          .setColor('White');
        await db.add(`${interaction.user.id}.bank.coins`, amount);
          await db.subtract(`${interaction.user.id}.balance.coins`, amount);
          await db.close();
          return interaction.editReply({ embeds: [success] });
        } else {
          let fail = new EmbedBuilder()
          .setTitle(':x: You do not have an opened bank account to deposit coins into')
          .setColor('#000000');
          await db.close();
          return interaction.editReply({ embeds: [fail] })
        }
 } else if (subcommand === 'withdraw') {
      let amount = interaction.options.getInteger('amount');
        if (userInfo.bank) {
      if (amount > userInfo.bank.coins) {
        let failCoin = new EmbedBuilder()
        .setTitle(':x: Your bank account balance is lower than the amount you are trying to withdraw from the account')
        .setColor('#000000');
        await db.close();
        return await interaction.editReply({ embeds: [failCoin] });
      }
          let success = new EmbedBuilder()
          .setTitle(`:white_check_mark: Successfully withdrew **${amount.toLocaleString()}** coins from your bank account`)
          .setColor('White');
        await db.subtract(`${interaction.user.id}.bank.coins`, amount);
          await db.add(`${interaction.user.id}.balance.coins`, amount);
          await db.close();
          return await interaction.editReply({ embeds: [success] });
        } else {
          let fail = new EmbedBuilder()
          .setTitle(':x: You do not have an opened bank account to withdraw coins from')
          .setColor('#000000');
          await db.close()
          return await interaction.editReply({ embeds: [fail] })
        }
  }
  },
} 