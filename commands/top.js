const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"top",
    type:"user",
    description:"Classement",
    note:"",
    owner:true,
    async execute(message, args) {
        //console.log(message.guild.members.cache)
        let top = sql.prepare(`SELECT id, answer_count FROM tiny_profil ORDER BY answer_count DESC LIMIT 10`).all()
        //await message.guild.members.cache.each(x => console.log(x.username))
        let text = "Classement pour les bonnes réponces données\n\n"
        for (let pas = 0; pas < top.length; pas ++) {
            //message.guild.members.fetch(top[pas].id).then(x => console.log(x.nickname))
            text += `${ message.guild.member( String(top[pas].id) ).displayName} : ${top[pas].answer_count}\n`
        }
        message.channel.send(text)
        if (message.deletable) message.delete()
    }  
}