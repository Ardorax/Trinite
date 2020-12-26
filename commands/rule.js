const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"rule",
    type:"mod",
    description:"Regle du bot",
    usage: "[true,false]",
    note:"",
    status:"mod",
    owner:true,
    execute(message, args) {
        if (args[1] == "set") {
            try {
                sql.prepare(`UPDATE main SET value = ? WHERE key = ?`).run(args.splice(3).join(" "),args[2]);
            } catch (e) {
                console.log(e)
                return message.channel.send("Désolé, une erreur c'est produite")
            }
            message.channel.send("Regle changée !")
        } else if (args[1] == "show") {
            message.channel.send(sql.prepare("SELECT value FROM main WHERE key=?").get(args[2]).value)
        } else {
            message.channel.send("/rule [set,show] [rule] (value ...)")
        }
    }
        
}

// Code de recup de la regle
// sql.prepare("SELECT value FROM main WHERE key = ?").get("rule").value