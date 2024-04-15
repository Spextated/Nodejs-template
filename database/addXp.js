const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);
const database = require('../index.js');

module.exports = {
  name: 'addXp',
  once: false,
  async execute(player, xp) {
    
await db.connect();

let userData = await db.get(player);
let maxXp = 50 * (1.5 * userData.rank.level);

if (userData.rank.xp + xp >= maxXp) {
    let leftOverXp = (userData.rank.xp + xp) - maxXp;
    database.emit('levelUp', (player, leftOverXp));
} else {
    await db.add(`${player}.rank.xp`, xp);
}
    
  }
}