const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey);
const wait = require('node:timers/promises').setTimeout;
const database = require('/opt/render/project/src/index.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('hunt')
  .setDescription('Fight a creature to receive rewards'), async execute(interaction) {
    await interaction.deferReply();
    await db.connect();
    const userData = await db.get(interaction.user.id);
    const creatures = ['Zombie', 'Skeleton', 'Spider', 'Slime', 'Ghost', 'Bear', 'Vampire', 'Werewolf', 'Unicorn', 'Dragon', 'Goblin', 'Gnome', 'Fairy'];
    
    let damageChance = ((Math.floor(Math.random() * 5) + 5) * userData.rank.level);
    const creature = creatures[Math.floor(Math.random() * creatures.length)];
    const defense = 5 * userData.rank.level;
    const level = userData.rank.level;
    const health = parseInt((100 * 1.15) * level) + 1;
    const damage = parseInt(damageChance / ((userData.defense + 100) / 100));

if (!userData.items.some(item => item.name.includes('⚔️'))) {
  const embed = new EmbedBuilder()
  .setTitle(':x: You do not have a sword to hunt with')
  .setColor('#000000');
  return await interaction.editReply({ embeds: [embed] });
}

let index = 0;

for (let i = 0; i < userData.items; i++) {
  if (userData.items[i].name.includes('⚔️')) {
      index = i;
  }
}
  let userDamage = parseInt(userData.items[index].damage / ((defense + 100) / 100));
  let embed = new EmbedBuilder()
    .setTitle(`⚔️ You found a **${creature}**`)
    .addFields({ name: 'You', value: `️Health: ${userData.health} ❤️\nDamage: ${userDamage} 💥\nDefense: ${userData.defense} 🛡️`, inline: true })
    .addFields({ name: `Level ${level} ${creature}`, value: `️Health: ${health} ❤️\n️Damage: ${damage} 💥\nDefense: ${defense} 🛡️`, inline: true })
    .setColor('White')
    .setTimestamp();
    
    await interaction.editReply({ embeds: [embed] });

    await wait(7000);

if (health / userDamage > (userData.health / damage)) {
        let coins = Math.floor(Math.random() * 250) + 500;
        let embed1 = new EmbedBuilder()
        .setTitle(`😰 You ran away and dropped **${coins}** coins along the way because you weren't able to defeat the **Level ${userData.rank.level} ${creature}**`)
          .setFooter({ text: 'Tip: Upgrade your damage & defense at the upgrade shop'})
        .setColor('#000000');
        database.emit('subCoins', interaction.user.id, coins);
        return await interaction.editReply({ embeds: [embed1] });
      }

      if (health / userDamage < (userData.health / damage)) {
    let xp = Math.floor(Math.random() * 5) + 5;
    let coins = Math.floor(Math.random() * 750) + 500;
    
    let embed2 = new EmbedBuilder()
      .setTitle(`😎 You defeated the **Level ${userData.rank.level} ${creature}** and received **${coins.toLocaleString()}** coins and **${xp}** XP!`)
      .setColor('White');
      
      database.emit('addXp', interaction.user.id, xp);
      database.emit('addCoins', interaction.user.id, coins);
      return await interaction.editReply({ embeds: [embed2] });
      }

      if (health / userDamage == (userData.health / damage)) {
      let embed3 = new EmbedBuilder()
        .setTitle(`You & the **Level ${userData.rank.level} ${creature}** were evenly matched, so you both ran away`)
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed3] });
    }   
    
  }
}