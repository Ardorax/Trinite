const parametre = require("../paramtre.json")
// test github
const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

const week_end_hour = 17
const week_hour = 11

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Pose une question et retourne l'id du gagant si il y en a un
function ask(client, question, reponse, time) {

    //Filtre des réponses
    let filter = messages => {

        if (messages.author.bot) return false;
        
        if (String(messages.content).toLowerCase().replace("-"," ").sansAccent() == reponse.toLowerCase().replace("-"," ").sansAccent()) {
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
            //Réaction sur le message
            collected.first().react("✅")

            //Texte du message
            let user_answer_counter = sql.prepare(`SELECT answer_count FROM tiny_profil WHERE id=?`).get(collected.first().author.id);
            let user_count_text = "C'est la première fois qu'il est le premier à donner la bonne réponse"
            if(user_answer_counter) user_count_text = `C'est la ${user_answer_counter.answer_count + 1}eme fois qu'il donne une bonne réponse`
            message.then(m => m.edit(`${question}\n${collected.first().author} a trouvé la bonne réponse !\n${user_count_text}`))
            //collected.first().author.id
            resolve(collected.first().author.id)
        })
        .catch(e => {
            message.then(m => m.edit(`${question}\nPersonne a trouvé la bonne réponse ! C'était : ${reponse}`))
            resolve(-1)
        })
    })


}

//Retourne une question qui n'a jamais été utilisé
function question() {
    //Total de question disponible
    let total_question = sql.prepare(`SELECT COUNT(use) FROM question_list WHERE use = ${0}`).get()["COUNT(use)"]

    //rng
    let rng = random(1,total_question) - 1

    let r = sql.prepare(`SELECT question, answer, use FROM question_list WHERE use = ? LIMIT 1 OFFSET ${rng}`).get("0");
    sql.prepare(`UPDATE "question_list" SET use = ? WHERE question = ?`).run(r.use + 1,r.question);
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
                let wallet = require("../commands/profil").has_profil(id)
                if(wallet) require("../commands/money").add_money(id,Number(sql.prepare(`SELECT value FROM main WHERE key=?`).get("question_reward").value))
                if(!sql.prepare(`SELECT answer_count FROM tiny_profil WHERE id=${id}`).get()) sql.prepare(`INSERT INTO tiny_profil (id) VALUES (?)`).run(id)
                sql.prepare(`UPDATE tiny_profil SET answer_count = ? WHERE id = ${id}`).run(sql.prepare(`SELECT answer_count FROM tiny_profil WHERE id=?`).get(id).answer_count + 1);
                client.guilds.cache.get("767084336737943582").channels.cache.get("799375039933579315").send(`<@${id}> a donné la bonne réponse`)
            } else client.guilds.cache.get("767084336737943582").channels.cache.get("799375039933579315").send(`Personne n'a trouvé la réponse`)
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

function all_question(client, middle_question_max_time, last_question_time) {

    return new Promise(async resolve => {

        //Definition du jour pour savoir le nb de question
        let nb_question = 0
        if(new Date().getUTCDay() == 0 || new Date().getUTCDay() == 6) nb_question = Number(sql.prepare(`SELECT value FROM main WHERE key=?`).get("nb_question_weekend").value)
        else nb_question = Number(sql.prepare(`SELECT value FROM main WHERE key=?`).get("nb_question_week").value)

        //Pose des questions le nombre nb_ask de fois
        for( let nb_ask = 1; nb_ask <= nb_question ; nb_ask++) {

            let time = middle_question_max_time
            if(nb_question == nb_ask) time = last_question_time

            //On pose la question
            let r = set_question(client, time)
            await r.then(e => {})
        }

        //Fin de la procedure donc on résout la promesse
        resolve()

    })
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
    let now = new Date()
    console.log(`Nous somme le : ${now.toString()}`)
    console.log(`Nous somme le : ${now.toUTCString()}`)
    
    //Decalage horaire
    //now.setHours(now.getHours() + 1)
    let next_time = new Date(now.getTime())

    //On détermine si le prochain jour(le prochain moment ou on lance une question) est le week end ou semaine

    //Si on a déja dépasser l'heure du jour
    if ((now.getUTCDay() == 0 && now.getUTCHours() >= week_end_hour) || ( now.getUTCDay() >= 1 && now.getUTCDay() <= 5 && now.getUTCHours() >= week_hour) || (now.getUTCDay() == 6 && now.getUTCHours() >= week_end_hour)) {
        next_time.setUTCDate(now.getUTCDate() + 1)

        //Si le landemain la question est a 13h 
        if (now.getUTCDay() <= 4) next_time.setUTCHours(week_hour,0,0,0)
        else next_time.setUTCHours(week_end_hour,0,0,0)
    } else {

        //cas ou le bot demare avant le moment de la question

        //Si on est un jour de semaine
        if (now.getUTCDay() >= 1 && now.getUTCDay() <= 5) next_time.setUTCHours(week_hour,0,0,0)
        else next_time.setUTCHours(week_end_hour,0,0,0)
    }

    //Decallage horaire
    //next_time.setHours(next_time.getHours() + 1)
    console.log(`Le prochain tirage a lieu a ${next_time.toString()}`)


    //Attente avant le premier déclanchement
    setTimeout(async () => {

        console.log("Premiere serie de question")
        await all_question(client, 600000, 3600000)
        console.log("Fin de la premiere série de question")

        //Definir a quel heure on lance le landemain
        now = new Date()
        let next_hour = week_end_hour
        if(now.getUTCDay() <=4) next_hour = week_hour
        let next_time = new Date()
        next_time.setUTCDate(now.getUTCDate() + 1)
        next_time.setUTCHours(next_hour, 0 ,0 ,0)

        console.log(`Prochaine question demain a ${next_hour} heures utc !`);
        console.log(next_time.toUTCString())

        channel(client).send(`Prochaine question demain a ${next_hour + 1} heures !`);
        await waiting(next_time - new Date())
        //await waiting(10000)

        console.log("Fin de la premiere attente")

        //Boucle pour les fois d'apres 
        for (let jour = 0; jour < 150; jour++) {

            console.log("Début d'une série de question")
            await all_question(client, 600000, 3600000)
            console.log("Fin d'une série de question")

            //Definir a quel heure on lance le landemain
            let next_hour = week_end_hour
            if(now.getUTCDay() <=4) next_hour = week_hour
            let next_time = new Date()
            next_time.setUTCDate(now.getUTCDate() + 1)
            next_time.setUTCHours(next_hour, 0 ,0 ,0)

            console.log(`Prochaine question demain a ${next_hour} heures utc !`);
            console.log(next_time.toUTCString())

            channel(client).send(`Prochaine question demain a ${next_hour + 1} heures !`);
            await waiting(next_time - new Date())
            //await waiting(3000)
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