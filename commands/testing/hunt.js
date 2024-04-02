const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Database } = require('quickmongo')
const db = new Database(process.env.mongoKey);
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
  .setName('hunt')
  .setDescription('Fight a creature to receive rewards'), async execute(interaction) {
    await interaction.deferReply();
    await db.connect();
    const userData = await db.get(interaction.user.id);
    const creatures = ['Zombie', 'Skeleton', 'Spider', 'Slime', 'Ghost', 'Bear', 'Vampire', 'Werewolf', 'Unicorn', 'Dragon', 'Goblin', 'Gnome', 'Fairy'];
    
    let damageChance = Math.floor(Math.random() * 10) + 1;
    const creature = creatures[Math.floor(Math.random() * creatures.length)];
    const defense = 10;
    const level = userData.rank.level;
    const health = parseInt((100 * 1.15) * level) + 1;
    const fakeDamage = (damageChance * level);
    const damage = parseInt(fakeDamage / ((userData.defense + 100) / 100));

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
    .addFields({ name: 'You', value: `️Health: ${userData.health} ❤️\nDamage: ${userDamage} 💥`, inline: true })
    .addFields({ name: `Level ${level} ${creature}`, value: `️Health: ${health} ❤️\n️Damage: ${damage} 💥`, inline: true })
    .setColor('White')
    .setTimestamp();
    
    await interaction.editReply({ embeds: [embed] });

    await wait(7000);

if (health / userDamage > (userData.health / damage)) {
        let embed1 = new EmbedBuilder()
        .setTitle(`😰 You ran away and dropped some coins along the way because you weren't able to defeat the **${creature}**`)
          .setFooter({ text: 'Tip: Upgrade your damage & defense at the upgrade shop'})
        .setColor('#000000');

        return await interaction.editReply({ embeds: [embed1] });
      }

      if (health / userDamage < (userData.health / damage)) {
    let embed2 = new EmbedBuilder()
      .setTitle(`😎 You defeated the **${creature}** and received some coins!`)
      .setColor('White');

      return await interaction.editReply({ embeds: [embed2] });
      }

      if (health / userDamage == (userData.health / damage)) {
      let embed3 = new EmbedBuilder()
        .setTitle(`You & the **${creature}** were evenly matched, so you both ran away`)
        .setColor('#000000');
        return await interaction.editReply({ embeds: [embed3] });
    }   
    
  }
}