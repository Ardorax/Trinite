const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

module.exports = {
    name:"couple",
    type:"mod",
    description:"Gestion des couples",
    usage: "",
    note:"",
    execute(message, args) {

        //Si les couples sont activés 
        if(sql.prepare("SELECT value FROM main WHERE key = ?").get("couple").value == "true") {

            let person = sql.prepare("SELECT couple FROM profil WHERE id = ?").get(message.author.id)
            if(!person) return message.channel.send("Il faut d'abord vous créer un profil !")
             
            //Si message public
            if(message.guild) {
                if(!message.mentions.users.first()) return message.channel.send("Vous devez mentionner une personne dans votre message pour vous mettre en couple avec elle !");

                let lover = sql.prepare("SELECT couple FROM profil WHERE id = ?").get(message.mentions.users.first().id)

                //Si l'amant n'a pas de profil
                if (!lover) {

                    //rien n'empeche d'enregistrer
                    message.channel.send("Votre personne n'a pas de profil, mais votre déclaration a bien été enregistrée.");
                    sql.prepare(`UPDATE profil SET couple = ? WHERE id = ${message.author.id}`).run(message.mentions.users.first().id);

                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("792485661922820117").send(`${message.author} ${message.author.username} => inconnue <@${message.mentions.users.first().id}>`) //log
                } else {

                    //Si troll main droite (oui je suis immature)
                    if (person.couple == "2") return message.channel.send("Vous n'êtes pas candidat au marige !")

                    //Si l'amant a deja fait sa declaration pour la personne
                    if(String(lover.couple) == String(message.author.id)) {
                        message.channel.send("Cette personne vous a déjà fait une déclaration d'amour, vous etes donc en couple !");
                        sql.prepare(`UPDATE profil SET couple = ? WHERE id = ${message.author.id}`).run(message.mentions.users.first().id);

                        message.client.guilds.cache.get("767084336737943582").channels.cache.get("792485661922820117").send(`${message.author} ${message.author.username} <=> <@${message.mentions.users.first().id}>`) //log
                    } else {
                        message.channel.send("Votre déclaration d'amour a été enregistrée.")
                        sql.prepare(`UPDATE profil SET couple = ? WHERE id = ${message.author.id}`).run(message.mentions.users.first().id);
                        message.client.guilds.cache.get("767084336737943582").channels.cache.get("792485661922820117").send(`${message.author} ${message.author.username} => <@${message.mentions.users.first().id}>`) //log
                    }

                }

            } else {
                //Cas d'une commande en message privés

                //Test au cas il est soumis au troll main droite version inchangeable
                let person = sql.prepare("SELECT couple FROM profil WHERE id = ?").get(message.author.id);
                if(!person) return message.channel.send("Il faut d'abord vous créer un profil !");
                if(person.couple == "2") return message.channel.send("Vous êtes en couple !");

                if(!args[1]) message.channel.send("0 : Aucune information sur votre profil\n1 : Vous déclare celibataire et l'affiche sur votre profil");
                if(args[1] == "0") {

                    //Option par defaut donc -1 dans la db mais l'utilisateur rentre 0 car + simple
                    sql.prepare(`UPDATE profil SET couple = ? WHERE id = ${message.author.id}`).run("-1");
                    message.channel.send("Aucune information disponible sur votre profil !")
                } else if(args[1] == "1") {

                    sql.prepare(`UPDATE profil SET couple = ? WHERE id = ${message.author.id}`).run("0");
                    message.channel.send("Vous êtes célibataire !")
                }
            }


        }
    }
        
}