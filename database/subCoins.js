const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);
const database = require('../index.js');

module.exports = {
  name: 'subCoins',
  once: false,
  async execute(player, coins) {
    
await db.connect();
let userData = await db.get(player);

if (userData.balance.coins - coins < 0) {
  await db.set(`${player}.balance.coins`, 0);
} else {
  await db.subtract(`${player}.balance.coins`, coins);
}

    
  }
}