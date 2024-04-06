const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);

module.exports = {
  name: 'levelUp',
  once: false,
  async execute(player, xp) {
await db.connect();

await db.add(`${player}.rank.level`, 1)
await db.set(`${player}.rank.xp`, xp);

let userData = await db.get(`${player}`);

await db.set(`${player}.health`, parseInt((100 * 1.15) * userData.rank.level)) + 1);
    
  }
}
