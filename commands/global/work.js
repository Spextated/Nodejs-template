const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo');
const db = new Database(process.env.mongoKey);

module.exports = {
  data: new SlashCommandBuilder()
  .setName('work')
  .setDescription('Work every 1 hour to get a reward'), cooldown: 3600, async execute(interaction) {
    await interaction.deferReply();
    await db.connect();
    let shifts = await db.get(`${interaction.user.id}.work.shifts`);
    let balance = await db.get(`${interaction.user.id}.balance.coins`);
   const jobs = ['Programmer', 'Builder', 'Waiter', 'Mechanic', 'Doctor', 'Actor', 'Youtuber', 'Streamer', 'Gamer', 'Pilot']
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    const chance = Math.floor(Math.random() * 100) + 1;
    let coins; 
  if (randomJob === 'Programmer') {
      coins = Math.floor(Math.random() * 2500) + 12500;
  } else if (randomJob === 'Builder') {
      coins = Math.floor(Math.random() * 2500) + 8000;
  } else if (randomJob === 'Waiter') {
    coins = Math.floor(Math.random() * 2500) + 7000;
  } else if (randomJob === 'Mechanic') {
    coins = Math.floor(Math.random() * 2500) + 9000;
  } else if (randomJob === 'Doctor') {
    coins = Math.floor(Math.random() * 2500) + 17500;
  } else if (randomJob === 'Actor') {
    coins = Math.floor(Math.random() * 2500) + 12500;
  } else if (randomJob === 'Youtuber') {
    coins = Math.floor(Math.random() * 2500) + 10000;
  } else if (randomJob === 'Streamer') {
    coins = Math.floor(Math.random() * 2500) + 11500;
  } else if (randomJob === 'Gamer') {
    coins = Math.floor(Math.random() * 2500) + 10000;
  } else if (randomJob === 'Pilot') {
    coins = Math.floor(Math.random() * 2500) + 13500;
  }

    if (chance < 25) {
    const embed = new EmbedBuilder()
      .setTitle(`😢 You were fired from your job as a **${randomJob}** and lost ${coins.toLocaleString()} coins`)
      .setColor('#000000');
      if ((balance - coins) <= 0) {
        await db.subtract(`${interaction.user.id}.balance.coins`, balance)
      } else {
      await db.subtract(`${interaction.user.id}.balance.coins`, coins)
      }
      return await interaction.editReply({ embeds: [embed] })
}
    
    if (!shifts) {
      await db.set(`${interaction.user.id}.work.shifts`, 1);
    } else {
      await db.add(`${interaction.user.id}.work.shifts`, 1);
    }
    
  const embed = new EmbedBuilder()
    .setTitle(`💪 You worked as a **${randomJob}** and earned ${coins.toLocaleString()} coins`)
    .setColor('White');
    await db.add(`${interaction.user.id}.balance.coins`, coins)
    return await interaction.editReply({ embeds: [embed] })
  },
}