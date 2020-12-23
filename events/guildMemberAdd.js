const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = (client, member) => {
    let annoncer = sql.prepare("SELECT value FROM main WHERE key = ?").get("welcome").value
    client.guilds.cache.get("767084336737943582").channels.cache.get("768077873587552267").send(String(annoncer).replace("{user}",member)) //log
    client.guilds.cache.get("734359515788476417").channels.cache.get("734366369415692339").send(String(annoncer).replace("{user}",member)) // oficiel
};