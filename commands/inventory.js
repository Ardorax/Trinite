const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

const Discord = require('discord.js')

const lang = require("./lang.json")
const color_file = require("./color.json");

const rep_time = 60000

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//faire des logs

module.exports = {
    name:"inventaire",
    type:"profil",
    description:"Profil des personnes",
    usage: "(couleur, citation)",
    note:"",
    aliases:["inv"],
    async execute(message, args) {

        //Si le message est un mp
        if (!message.guild) {

            //la personne 
            let person = sql.prepare("SELECT inv_color, color, lastname, quote, inv_quote, badges FROM profil WHERE id=?").get(message.author.id)
            if (!person) message.channel.send("Vous n'avez pas de profil.")

            //Couleur
            if (String(args[1]).toLowerCase() == "couleur" || String(args[1]).toLowerCase() == "co") {
                if (person.inv_color == "-1") return message.channel.send("Tu n'a pas de couleur dans ton inventaire")
                else if (args[2]) {
                    if(person.inv_color.split(",")[args[2]]) {
                        sql.prepare(`UPDATE profil SET color = ? WHERE id = ${message.author.id}`).run(  color_file[ person.inv_color.split(",")[args[2]].split(".")[0] ][ person.inv_color.split(",")[args[2]].split(".")[1] ].hex)  ;
                        message.channel.send(`Vous avez choisit la couleur ${color_file[ person.inv_color.split(",")[args[2]].split(".")[0] ][ person.inv_color.split(",")[args[2]].split(".")[1] ].name}`)
                    } else {
                        message.channel.send("La couleur que vous avez choisit n'est pas dans votre inventaire.")
                    }
                }
                else {
                    let c = ""
                    let b = ""
                    for (let i = 0 ; i < person.inv_color.split(",").length; i ++) {
                        let color = person.inv_color.split(",")[i]
                        if (color.split(".")[0] == "c") {
                            c = c + i + " : " + color_file.c[color.split(".")[1]].id + " " + (color_file.c[color.split(".")[1]].name) + "\n"
                        }
                        if (color.split(".")[0] == "b") {
                            b = b + i + " : " + color_file.b[color.split(".")[1]].name + "\n"
                        }
                    }
                    let content = new Discord.MessageEmbed()
                    .setTitle(`Couleurs de ${person.lastname}`)
                    if (b != "") content.addField("Basique",b)
                    content
                    .addField("Classique",c)
                    .setColor(person.color)
                    message.channel.send(content)
                }

                //Citation
            } else if (String(args[1]).toLowerCase() == "citation" || String(args[1]).toLowerCase() == "ci") {
                if (person.inv_quote == "-1") return message.channel.send("Tu n'a pas de citation dans ton inventaire")
                else if (args[2]) {
                    if (args[2] == "-1") {
                        sql.prepare(`UPDATE profil SET quote = ? WHERE id = ${message.author.id}`).run(-1);
                        message.channel.send( require('./profil').profil(message, message.author.id));
                    } else if(String(person.inv_quote).split(",")[args[2]]) {
                        sql.prepare(`UPDATE profil SET quote = ? WHERE id = ${message.author.id}`).run(String(person.inv_quote).split(",")[args[2]]);
                        message.channel.send( require('./profil').profil(message, message.author.id) );
                    } else {
                        message.channel.send("Cette citation n'est pas dans votre inventaire.")
                    }
                } else {
                    let inv = String(person.inv_quote).split(",")
                    let r = "Voici la liste de vos citations : "
                    for (let i = 0; i < inv.length; i ++) {
                        let quote = sql.prepare("SELECT quote, author FROM quote WHERE id=?").get(inv[i])
                        r = `${r}\n ${i} : **${quote.author}** : ${quote.quote}`
                    }
                    message.channel.send(r, {
                        split:true
                    })
                }
            } else {
                let color = person.inv_color.split(",").length
                if (person.inv_color == -1) color = 0
                let citation = person.inv_quote.split(",").length
                if (person.inv_quote == -1) citation = 0
                let badges = person.badges.split(",").length
                if (person.badges == -1) badges = 0
                message.channel.send(`Vous possedez :\n${color} couleurs\n${citation} citations\n${badges} badges`)
            }
        }
    },
    drop_quote(id) {

        //Inventaire de la personnne 
        let inv = String(sql.prepare("SELECT inv_quote FROM profil WHERE id=?").get(id).inv_quote).split(",")

        //Total de citation disponible
        let total_citation = sql.prepare(`SELECT COUNT(quote) FROM quote WHERE rarity <= 100`).get()["COUNT(quote)"]

        //rng
        let rng = random(1,total_citation) - 1

        //On trouve l'id correspondant au chiffre aleatoire
        let id_quote = sql.prepare(`SELECT id FROM quote WHERE rarity <= 100 LIMIT 1 OFFSET ${rng}`).get().id

        //max de fois a chercher
        let max = 0

        
        //Tant que on trouve pas une citation qu'il a pas encore
        while (inv.includes(String(id_quote)) && max < 50) {
            max++
            rng = random(1,total_citation) - 1
            id_quote = sql.prepare(`SELECT id FROM quote WHERE rarity <= 100 LIMIT 1 OFFSET ${rng}`).get().id
        }
        if (max == 50) id_quote = -1
        return String(id_quote)
    },
    drop_color_classic(id) {

        //Inventaire de la personnne 
        let inv = String(sql.prepare("SELECT inv_color FROM profil WHERE id=?").get(id).inv_color).split(",")
        //Total de couleur classique disponible
        let total_color = Object.values(color_file.c).length
        
        //rng
        let id_color = Object.keys(color_file.c)[random(0, total_color - 1)]

        //max de fois a chercher
        let max = 0

        //Tant que on trouve pas une citation qu'il a pas encore
        while (inv.includes("c."+id_color) && max < 50) {
            max++
            id_color = Object.keys(color_file.c)[random(0, total_color - 1)]
        }
        if (max == 50) id_color = -1
        return "c." + id_color
    }
       
}