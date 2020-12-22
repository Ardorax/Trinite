const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

const color_file = require("./color.json")

module.exports = {
    name:"give",
    type:"mod",
    description:"Don d'objet profil",
    args:true,
    usage: "[mention] [citation,couleur,badge] [nom]",
    note:"",
    owner:true,
    execute(message, args) {
        if (args[2] == "couleur" || args[2] == "co" || args[2] == "color") {
            if (!args[3]) return message.channel.send("Il n'y a pas de couleur a donné")
            else {
                if(!color_file[ args[3].split(".")[0] ][ args[3].split(".")[1] ] ) return message.channel.send("Cette couleur n'existe pas ! (ex : c.aqua)")
                else {
                    let person = sql.prepare("SELECT inv_color FROM profil WHERE id=?").get(message.mentions.users.first().id)
                    if (person.inv_color == -1) {
                        sql.prepare(`UPDATE profil SET inv_color = ? WHERE id = ${message.mentions.users.first().id}`).run(args[3]);
                        return message.channel.send("Don de sa premiere couleur !")
                    } else if (!person.inv_color.split(",").includes(args[3])) {
                        sql.prepare(`UPDATE profil SET inv_color = ? WHERE id = ${message.mentions.users.first().id}`).run(person.inv_color + "," + args[3]);
                        return message.channel.send("Une nouvelle couleur a été donné")
                    }
                }
            }
        }
    }
        
}