const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"db",
    type:"mod",
    description:"modif db",
    note:"",
    status:"mod",
    owner:true,
    execute(message, args) {
        if (args[1] == "update") {
            let first_test = sql.prepare(`SELECT ${args[3]} FROM ${args[2]} WHERE ${args[4]} = ?`).get(args.slice(5).join(" "))
            if(!first_test) return message.channel.send("La case n'a pas été trouvé !")
            message.channel.send("Quelle est la nouvelle valeur ? Avant : " + first_test[args[3]])
            let filter = msg => {
                if (msg.author.id == "277100743616364544") return true
                return false
            }
            message.channel.awaitMessages(filter, {max:1, time:120000, errors:["time"]})
            .then(collected => {
                try {
                    sql.prepare(`UPDATE ${args[2]} SET ${args[3]} = ? WHERE ${args[4]} = ?`).run(collected.first().content, args.slice(5).join(" "));
                    message.channel.send("Ok")
                } catch (e) {
                    console.log(e)
                    return message.channel.send("Désolé, une erreur c'est produite")
                }
            })
        } else if (args[1] == "help") {
            message.channel.send("/db update [table] [column] [Where]")
        }
    }
        
}

// Code de recup de la regle
// sql.prepare("SELECT value FROM main WHERE key = ?").get("rule").value