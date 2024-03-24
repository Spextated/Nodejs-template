const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);
const { EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
  name: 'newPlayer',
  once: false,
  async execute(interaction) {
    await db.connect();

    const webhookClient2 = new WebhookClient({ id: process.env.webhookID3, token: process.env.webhookToken3 });
    
    const abilities = [{ name: 'Brute I', chance: 75, power: 0.85}, { name: 'Brute II', chance: 20, power: 0.70}, { name: 'Brute III', chance: 5, power: 0.55}, { name: 'Swordmaster I', chance: 75, power: 0.85} , { name: 'Swordmaster II', chance: 20, power: 0.70}, { name: 'Swordmaster III', chance: 5, power: 0.55}];

    const expanded = abilities.flatMap(ability => Array(ability.chance).fill(ability));
    const ability = expanded[Math.floor(Math.random() * expanded.length)];
    console.log('Ability: ' + ability.name);
    
    await db.set(`${interaction.user.id}.rank`, { level: 1, xp: 0 });
    await db.set(`${interaction.user.id}.strength`, { strength: 0 });
    await db.set(`${interaction.user.id}.ability`, { name: `${ability.name}`, percentage: `${ability.power}`, level: 0, xp: 0});
      await db.set(`${interaction.user.id}.balance`, { coins: 0, diamonds: 0 });
    await db.set(`${interaction.user.id}.health`, 100);
    await db.set(`${interaction.user.id}.duels`, { wins: 0, losses: 0 })
    await db.set(`${interaction.user.id}.items`, []);

    let embed = new EmbedBuilder()
    .setTitle('New Player Data')
    .addFields({ name: 'Player Tag', value: interaction.user.tag, inline: false })
    .addFields({ name: 'Player ID', value: interaction.user.id, inline: false })
    .addFields({ name: 'Guild ID', value: interaction.guild.id, inline: false })
    .addFields({ name: 'Data Creation Date', value: `<t:${parseInt(Date.now() / 1000)}:F>`, inline: false })
      .setColor('#2F3136')
      .setFooter({ text: `${await db.count()} Total Players` })
        .setTimestamp();

await webhookClient2.send({
      content: '',
      username: 'Equinox',
      avatarURL: 'https://i.imgur.com/or0Oxrv.jpg',
      embeds: [embed],
    }).catch(error => console.log(error));

  }
}