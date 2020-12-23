const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"annoncer",
    type:"mod",
    description:"Modification des annonceurs",
    args:false,
    usage: "[set,show] [nouveau message d'annonce] note : {user} mentionne la personne" ,
    note:"",
    status:"mod",
    execute(message, args) {
        if (String(args[1]).toLowerCase() == "set") {
            try {
                sql.prepare(`UPDATE main SET value = ? WHERE key = ?`).run(args.slice(2).join(" "),"welcome")
                message.channel.send("Le nouveau message d'annonce d'arrivée d'un nouveau membre est :\n" + args.slice(2).join(" "))
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("768078080681705492").send(`new annoncer set by ${message.author}\n${args.slice(2).join(" ")}`)
            } catch (e) {
                message.channel.send("Désolé, une erreur c'est produite")
                console.log(e)
            }
        } else {
            message.channel.send(sql.prepare("SELECT value FROM main WHERE key=?").get("welcome").value)
        }
    }
        
}