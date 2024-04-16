const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);
const database = require('../index.js');

module.exports = {
  name: 'subDiamonds',
  once: false,
  async execute(player, diamonds) {
    
await db.connect();
let userData = await db.get(player);

if (userData.balance.diamonds - diamonds < 0) {
  await db.set(`${player}.balance.diamonds`, 0);
} else {
  await db.subtract(`${player}.balance.diamonds`, diamonds);
}

    
  }
}