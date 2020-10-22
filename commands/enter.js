const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"enter",
    type:"mod",
    description:"Activation ou desactivation de la possibilité d'avoir le role élève",
    usage: "[true,false]",
    note:"",
    status:"mod",
    execute(message, args) {
        if (args[1] == "true") {
            try {
                message.channel.send("Entrer sur le serveur est possible");
                sql.prepare(`UPDATE main SET enter = 1 WHERE id = 0`).run();
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("768877079634378813").send(`✅${message.author} ouvre le serveur`)
            } catch (e) {
                console.log(e)
                message.channel.send("Désolé, une erreur c'est produite")
            }
        } else if (args[1] == "false") {
            try {
                message.channel.send("Entrer sur le serveur n'est pas possible");
                sql.prepare(`UPDATE main SET enter = 0 WHERE id = 0`).run();
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("768877079634378813").send(`:x:${message.author} ferme le serveur`)
            } catch (e) {
                console.log(e)
                message.channel.send("Désolé, une erreur c'est produite")
            }
        } else {
            x = sql.prepare("SELECT enter FROM main WHERE id=0").get().enter
            if (x == 0) {
                message.channel.send("/enter [true,false] autorise l'entrée sur le serveur. Actuellement, on ne peut pas le rejoindre");
            } else message.channel.send("/enter [true,false] autorise l'entrée sur le serveur. Actuellement, on peut le rejoindre");
        }
    }
        
}