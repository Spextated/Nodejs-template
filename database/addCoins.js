const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);
const database = require('../index.js');

module.exports = {
  name: 'addCoins',
  once: false,
  async execute(player, coins) {
    
await db.connect();

await db.add(`${player}.balance.coins`, coins);
    
  }
}