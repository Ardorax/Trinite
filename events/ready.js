const parametre = require("../paramtre.json")

const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

//Pose une question et retourne l'id du gagant si il y en a un
function ask(client, question, reponce, time) {

    //Filtre des réponces
    let filter = messages => {

        if (messages.author.bot) return false;
        
        if (String(messages.content).toLowerCase().sansAccent() == reponce.toLowerCase().sansAccent()) {
            return true
        } else {
            return false
        }
    }

    return new Promise(resolve => {
        //Envoie de la question et on garde en memoire le message
        let message = channel(client).send(question)

        //Attente des messages
        channel(client).awaitMessages(filter, {time:time, max:1, errors:["time"]})
        .then(collected => {
            let user_answer_counter = sql.prepare(`SELECT answer_count FROM tiny_profil WHERE id=?`).get(collected.first().author.id);
            let user_count_text = "C'est la première fois qu'il est le premier à donner la bonne réponce"
            if(user_answer_counter) user_count_text = `C'est la ${user_answer_counter.answer_count + 1}eme fois qu'il donne une bonne réponce`
            message.then(m => m.edit(`${question}\n${collected.first().author} a trouvé la bonne réponce !\n${user_count_text}`))
            //collected.first().author.id
            resolve(collected.first().author.id)
        })
        .catch(e => {
            message.then(m => m.edit(`${question}\nPersonne a trouvé la bonne réponce !`))
            resolve(-1)
        })
    })


}

//Retourne une question qui n'a jamais été utilisé
function question() {
    let r = sql.prepare(`SELECT question, answer, use FROM question_list WHERE use=${0}`).get();
    //sql.prepare(`UPDATE "question_list" SET use = ? WHERE question = ?`).run(r.use + 1,r.question);
    delete r.use
    return r
}

function set_question(client, time) {

    return new Promise(async resolve => {
        //On trouve une question et on la défini comme déjà posé
        let select = question()

        //On pose la question
        let id = ask(client, select.question, select.answer, time)

        client.guilds.cache.get("767084336737943582").channels.cache.get("799375039933579315").send(`Question : ${select.question}`)
        
        //On donne l'argent si faut en donner
        await id.then(id => {

            //Si une personne a répondu
            if(id != -1) {
                let wallet = require("../commands/money").has_accont(id)
                if(!wallet) require("../commands/money").create_accont(id)
                require("../commands/money").add_money(id,Number(sql.prepare(`SELECT value FROM main WHERE key=?`).get("question_reward").value))
                sql.prepare(`UPDATE tiny_profil SET answer_count = ? WHERE id = ${id}`).run(sql.prepare(`SELECT answer_count FROM tiny_profil WHERE id=?`).get(id).answer_count + 1);
                client.guilds.cache.get("767084336737943582").channels.cache.get("799375039933579315").send(`<@${id}> a donné la bonne réponce`)
            } else client.guilds.cache.get("767084336737943582").channels.cache.get("799375039933579315").send(`Personne n'a trouvé la réponce`)
        })

        resolve()
    })
}

//Fonction pour attendre un temps variable
function waiting(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({})
        }, time)
    })
}

//Fonction qui envoie dans le bon channel suivant si bot de dev ou pas 
function channel(client) {
    if(parametre.start_mode == "beta") {
        return client.guilds.cache.get("767084336737943582").channels.cache.get("798280936667086868")
    } else {
        return client.guilds.cache.get("734359515788476417").channels.cache.get("784334242540683314")
    }
}

module.exports = async (client) => {

    //Message de départ
    console.log(`Logged in as ${client.user.tag}!`);

    //Presence
    client.user.setPresence({
        status:"online",
        activity : {
            name:"rendre le monde meilleur",
            type:"COMPETING"
        }
    })

    //recuperation des anciens messages
    if(parametre.start_mode == "official") {
        client.guilds.cache.get("767084336737943582").channels.cache.get("768078226723176489").send(`Je me connecte`)
        client.guilds.cache.get("767084336737943582").channels.cache.get("768165464492343296").messages.fetch({limit:3})
        client.guilds.cache.get("734359515788476417").channels.cache.get("763800449056505856").messages.fetch({limit:10})
        client.guilds.cache.get("734359515788476417").channels.cache.get("762047438890467328").messages.fetch({limit:10})
    }

    //Initialisation de la premiere boucles
    //Calendrier semaine 13h00, max 5 min de rep puis 1heure, week end 18h00
    let now = new Date(2021, 0, 15, 12, 59, 58)
    console.log(`Nous somme le : ${now.toString()}`)
    
    //Decalage horaire
    //now.setHours(now.getHours() + 1)
    let next_time = new Date(now.getTime())

    //On détermine si le prochain jour(le prochain moment ou on lance une question) est le week end ou semaine

    //Si on a déja dépasser l'heure du jour
    if ((now.getDay() == 0 && now.getHours() >= 18) || (now.getDay() == 1 && now.getHours() >= 13) || (now.getDay() == 2 && now.getHours() >= 13) || (now.getDay() == 3 && now.getHours() >= 13) || (now.getDay() == 4 && now.getHours() >= 13) || (now.getDay() == 5 && now.getHours() >= 13) || (now.getDay() == 6 && now.getHours() >= 18)) {
        next_time.setDate(now.getDate() + 1)

        //Si le landemain la question est a 13h 
        if (now.getDay() <= 4) next_time.setHours(13,0,0,0)
        else next_time.setHours(18,0,0,0)
    } else {

        //cas ou le bot demare avant le moment de la question

        //Si on est un jour de semaine
        if (now.getDay() >= 1 && now.getDay() <= 5) next_time.setHours(13,0,0,0)
        else next_time.setHours(18,0,0,0)
    }

    //Decallage horaire
    //next_time.setHours(next_time.getHours() + 1)
    console.log(`Le prochain tirage a lieu a ${next_time.toString()}`)


    //Attente avant le premier déclanchement
    setTimeout(async () => {

        console.log("Premier tirage")

        //Definition du jour pour savoir le nb de question
        let nb_question = 0
        if(new Date().getDay() == 0 || new Date().getDay() == 6) nb_question = Number(sql.prepare(`SELECT value FROM main WHERE key=?`).get("nb_question_weekend").value)
        else nb_question = Number(sql.prepare(`SELECT value FROM main WHERE key=?`).get("nb_question_week").value)

        //Pose la premiere question et attend la réponce le nb de fois 
        for( let nb_ask = 0; nb_ask < nb_question ; nb_ask++) {

            let max_time = (60000 * 5)
            if(nb_question - 1 == nb_ask) max_time = (60000 * 60)

            //On pose la question
            let r = set_question(client, max_time)
            await r.then(e => {})
        }

        //Definir a quel heure on lance le landemain
        let next_hour = 18
        if(now.getDay() <=4) next_hour = 13
        let next_time = new Date(new Date().setDate(new Date().getDate() + 1))

        console.log("Premiere attente")
        channel(client).send(`Prochaine question demain a ${next_hour} heures !`)
        await waiting(next_time.setHours(next_hour) - new Date())
        console.log("Fin de la premiere attente")

        //Boucle pour les fois d'apres 
        for (let jour = 0; jour < 5; jour++) {

            for( let nb_ask = 0; nb_ask < nb_question ; nb_ask++) {

                let max_time = (60000 * 5)
                if(nb_question - 1 == nb_ask) max_time = (60000 * 60)
    
                //On pose la question
                let r = set_question(client, max_time)
                await r.then(e => {})
            }

            //Definir a quel heure on lance le landemain
            let next_hour = 18
            if(now.getDay() <=4) next_hour = 13
            let next_time = new Date(new Date().setDate(new Date().getDate() + 1))

            channel(client).send(`Prochaine question demain a ${next_hour} heures !`)
            await waiting(next_time.setHours(next_hour) - new Date())
        }

    }, next_time - now);

}



//Supprime les accents
String.prototype.sansAccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
     
    return str;
}





