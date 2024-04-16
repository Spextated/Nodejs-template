const { Database } = require("quickmongo");
const db = new Database(process.env.mongoKey);
const database = require('../index.js');

module.exports = {
  name: 'addDiamonds',
  once: false,
  async execute(player, diamonds) {
    
await db.connect();

await db.add(`${player}.balance.diamonds`, diamonds);
    
  }
}