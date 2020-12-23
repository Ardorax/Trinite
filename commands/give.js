const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

const color_file = require("./color.json")
const badges_file = require("./badges.json")

module.exports = {
    name:"give",
    type:"mod",
    description:"Don d'objet profil",
    args:true,
    usage: "[mention] [citation,couleur,badge] [nom]",
    note:"",
    owner:true,
    execute(message, args) {

        //Cas des couleurs 
        if (args[2] == "couleur" || args[2] == "co" || args[2] == "color") {

            if (!args[3]) return message.channel.send("Il n'y a pas de couleur a donné")
            else {
                let r = this.give_color(message.mentions.users.first().id,args[3])
                if (r.valid) message.channel.send(`Correct : ${r.text}`)
                else message.channel.send(`Erreur : ${r.text}`)
            }

        } else if (args[2] == "citation" || args[2] == "ci" || args[2] == "quote") {

            let r = this.give_quote(message.mentions.users.first().id,args[3]);
            if (r.valid) message.channel.send(`Correct : ${r.text}`)
            else message.channel.send(`Erreur : ${r.text}`)

            //Cas des badges
        } else if (args[2] == "badges" || args[2] == "badge"|| args[2] == "b") {
            let r = this.give_badges(message.mentions.users.first().id,args[3]);
            if (r.valid) message.channel.send(`Correct : ${r.text}`)
            else message.channel.send(`Erreur : ${r.text}`)
        }
    },
    give_color(id,color) {

        //Réponce du module
        let answer = {
            valid : false,
            text : ""
        }

        //Test si la couleur et la personne sont dans la db
        if(!color_file[ color.split(".")[0] ][ color.split(".")[1] ] ) {
            answer.text = "Cette couleur n'existe pas ! (ex : c.aqua)"
            return answer
        }

        let person = sql.prepare("SELECT inv_color FROM profil WHERE id=?").get(id)
        if(!person) {
            answer.text = "La personne n'a pas de profil"
            return answer
        }

        //Si la personne n'a pas de couleur alors on remplace le -1 par la couleurs
        if (person.inv_color == -1) {
            sql.prepare(`UPDATE profil SET inv_color = ? WHERE id = ${id}`).run(color);

            answer.text = "Don de sa premiere couleur !"
            answer.valid = true
            return answer

            //Si la personne a deja une couleur
        } else if (!person.inv_color.split(",").includes(color)) {
            sql.prepare(`UPDATE profil SET inv_color = ? WHERE id = ${id}`).run(person.inv_color + "," + color);

            answer.text = "Une nouvelle couleur a été donné"
            answer.valid = true
            return answer

            //Si faut supprimer
        } else {
            let list = String(person.inv_color).split(",");
            list.splice(String(person.inv_color).split(",").indexOf(color), 1);

            //Si elle n'aura plus de couleur
            if (list.length == 0) {
                sql.prepare(`UPDATE profil SET inv_color = ? WHERE id = ${id}`).run("-1");

                answer.text = "La personne n'a plus de couleur"
                answer.valid = true
                return answer

                //Si elle aura encore des couleurs
            } else {
                sql.prepare(`UPDATE profil SET inv_color = ? WHERE id = ${id}`).run(list.join(","));

                answer.text = "La personne a perdu une couleur"
                answer.valid = true
                return answer
            }
        }
    },
    give_quote(id, quote) {

        let answer = {
            valid : false,
            text : ""
        }

        if (!sql.prepare("SELECT id FROM quote WHERE id=?").get(quote)) {
            answer.text = "Cette citation n'existe pas"
            return answer
        }

        let person = sql.prepare("SELECT inv_quote FROM profil WHERE id=?").get(id)

        if(!person) {
            answer.text = "La personne n'a pas de profil"
            return answer
        }

        //Si la personne n'a pas de citation alors on remplace le -1 par la citation
        if (person.inv_quote == -1) {
            sql.prepare(`UPDATE profil SET inv_quote = ? WHERE id = ${id}`).run(quote);
            answer.valid = true
            answer.text = "Don de sa premiere citation !"
            return answer

            //Si la personne a deja une citation
        } else if (!person.inv_quote.split(",").includes(quote)) {
            sql.prepare(`UPDATE profil SET inv_quote = ? WHERE id = ${id}`).run(person.inv_quote + "," + quote);
            answer.valid = true
            answer.text = "Une nouvelle citation a été donné"
            return answer

            //Si faut supprimer
        } else {
            let list = String(person.inv_quote).split(",");
            list.splice(String(person.inv_quote).split(",").indexOf(quote), 1);

            //Si elle n'aura plus de citation
            if (list.length == 0) {
                sql.prepare(`UPDATE profil SET inv_quote = ? WHERE id = ${id}`).run("-1");
                answer.valid = true
                answer.text = "La personne n'a plus de citation"
                return answer

                //Si elle aura encore des citation
            } else {
                sql.prepare(`UPDATE profil SET inv_quote = ? WHERE id = ${id}`).run(list.join(","));
                answer.valid = true
                answer.text = "La personne a perdu une citation"
                return answer
            }
        }
    },
    give_badges(id, badge) {

        let answer = {
            valid:true,
            text:""
        }

        if(!badges_file[badge] ) {
            answer.valid = false
            answer.text = "Ce badge n'existe pas ! (ex : rl1top1)"
            return answer
        }

        let person = sql.prepare("SELECT badges FROM profil WHERE id=?").get(id)
        if(!person) {
            answer.valid = false
            answer.text = "La personne n'a pas de profil"
            return answer
        }

        //Si la personne n'a pas de citation alors on remplace le -1 par la citation
        if (person.badges == -1) {
            sql.prepare(`UPDATE profil SET badges = ? WHERE id = ${id}`).run(badge);
            answer.text = "Don de son premiere badges !"
            return answer

            //Si la personne a deja une citation
        } else if (!person.badges.split(",").includes(badge)) {
            sql.prepare(`UPDATE profil SET badges = ? WHERE id = ${id}`).run(person.badges + "," + badge);
            answer.text = "Un nouveau badges a été donné"
            return answer

            //Si faut supprimer
        } else {
            let list = String(person.badges).split(",");
            list.splice(String(person.badges).split(",").indexOf(badge), 1);

            //Si elle n'aura plus de badges
            if (list.length == 0) {
                sql.prepare(`UPDATE profil SET badges = ? WHERE id = ${id}`).run("-1");
                answer.text = "La personne n'a plus de badges"
                return answer

                //Si elle aura encore des badges
            } else {
                sql.prepare(`UPDATE profil SET badges = ? WHERE id = ${id}`).run(list.join(","));
                answer.text = "La personne a perdu un badges"
                return answer
            }
        }
    }
        
}