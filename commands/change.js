const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"sql",
    type:"mod",
    description:"Supression de message",
    args:true,
    usage: "[nb_de_msg_a_suppr]",
    note:"",
    owner:true,
    execute(message, args) {
        console.log(new String(args.splice(1).join(" ")))
        let sql_request = sql.prepare("SELECT lastname, name FROM profil WHERE civ=? ORDER BY birth_year LIMIT 3").get(0)
        console.log(sql_request)
    }
        
}