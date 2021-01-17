const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"money",
    type:"user",
    description:"Systeme d'argent",
    usage: "",
    note:"",
    execute(message, args) {
        if(!this.has_accont(message.author.id)) {
            this.create_accont(message.author.id)
            return message.channel.send("Vous n'aviez pas de compte en banque. Désormais, vous en avez un !")
        } else {
            message.channel.send(`Vous avez ${this.money(message.author.id)} argents !`)
        }
    },
    has_accont(id) {
        let wallet = sql.prepare(`SELECT money FROM profil WHERE id=${id}`).get()
        return wallet ? true : false
    },
    //Cb d'argent il a
    money(id) {
        return Number(sql.prepare(`SELECT money FROM profil WHERE id=${id}`).get().money)
    },
    add_money(id, amount) {
        sql.prepare(`UPDATE profil SET money = ? WHERE id = ${id}`).run(this.money(id) + amount);
    }
        
}