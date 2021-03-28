const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');

const Discord = require('discord.js')

const lang = require("./lang.json")

const rep_time = 60000

//faire des logs

module.exports = {
    name:"profil",
    type:"profil",
    description:"Profil des personnes",
    usage: "(mention)",
    note:"",
    aliases:["p","profile"],
    async execute(message, args) {
        if (!message.guild) {

            //Si la personne a déjà un profil
            if (sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()) {

                if (sql.prepare(`SELECT ban FROM profil WHERE id=${message.author.id}`).get().ban == 1) return message.channel.send("Tu a été banni du systeme de profil")
                
                if(String(args[1]).toLowerCase() == "nom") {
                    await this.nom(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "prenom" || String(args[1]).toLowerCase() == "prénom") {
                    await this.prenom(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "civ") {
                    await this.civ(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "niveau") {
                    await this.niveau(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "classe") {
                    await this.classe(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "anniversaire") {
                    await this.anniversaire(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "lva") { 
                    await this.lva(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "lvb") {
                    await this.lvb(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "spe1") {
                    await this.spe1(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "spe2") {
                    await this.spe2(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "spe3") {
                    await this.spe3(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "option") {
                    await this.option(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "futur") {
                    await this.futur(message,args)
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                } else if(String(args[1]).toLowerCase() == "voir") {
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))
                }else if (String(args[1]).toLowerCase() == "suppression") {
                    this.delete(message, args)
                } else {
                    message.channel.send("Si vous souhaitez modifier votre profil, tapez /profil def [civ,nom,prenom,niveau,classe,anniversaire,lva,lvb,spe1,spe2,spe3,option,futur,suppression]");
                }
            } else {

                //Si la personne n'a pas de profil

                //le filtres des messages
                const filter = msg => !msg.author.bot && msg.content == "1"

                message.channel.send("Bonjour, je vois que vous n'avez pas de profil sur le serveur de la Trinité, si vous souhaitez en créé un : Envoyez 1")
                await message.channel.awaitMessages(filter, {max:1, time:rep_time})
                .then(async collected => {

                    //Si le nombre de fail dépasse 15 on stop
                    let fail = 0
                    let max_fail = 15
                    let n = 0
                    let fail_msg = "Fin du programme, pour finir la création du profil utilisez la commande /p"

                    await message.channel.send("Très bien, merci d'envoyer par message les réponses aux questions que je vous demande")

                    //Récuperation des bonnes réponce aux quiz pour donner l'argent
                    let money = 0
                    let tiny = sql.prepare(`SELECT answer_count FROM tiny_profil WHERE id=${message.author.id}`).get()
                    if(tiny) money = Number(tiny.answer_count) * 10

                    sql.prepare(`INSERT INTO profil (id, money) VALUES (?, ?)`).run(message.author.id, money)

                    while (fail < max_fail) {
                        r = await this.nom(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    while (fail < max_fail) {
                        r = await this.prenom(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    while (fail < max_fail) {
                        r = await this.civ(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    //message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()));

                    while (fail < max_fail) {
                        n = await this.niveau(message,[])
                        if (n == 1) fail = fail + 1
                        else if (n == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    n = sql.prepare(`SELECT class FROM profil WHERE id=${message.author.id}`).get().class

                    while (fail < max_fail) {
                        r = await this.classe(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    while (fail < max_fail) {
                        r = await this.anniversaire(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    while (fail < max_fail) {
                        r = await this.lva(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    while (fail < max_fail) {
                        r = await this.lvb(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    if (n == 0 || n == 1) {
                        while (fail < max_fail) {
                            r = await this.spe1(message,[])
                            if (r == 1) fail = fail + 1
                            else if (r == 2) return message.channel.send(fail_msg)
                            else break;
                        }
                    }

                    if (n == 0 || n == 1) {
                        while (fail < max_fail) {
                            r = await this.spe2(message,[])
                            if (r == 1) fail = fail + 1
                            else if (r == 2) return message.channel.send(fail_msg)
                            else break;
                        }
                    }

                    if(n== 1) {
                        while (fail < max_fail) {
                            r = await this.spe3(message,[])
                            if (r == 1) fail = fail + 1
                            else if (r == 2) return message.channel.send(fail_msg)
                            else break;
                        }
                    }

                    while (fail < max_fail) {
                        r = await this.option(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    while (fail < max_fail) {
                        r = await this.futur(message,[])
                        if (r == 1) fail = fail + 1
                        else if (r == 2) return message.channel.send(fail_msg)
                        else break;
                    }

                    if (fail == max_fail) return message.channel.send("Vous avez fait trop de réponses pas attendu par le bot. Pour continuer a faire votre profil taper /p")
                    message.channel.send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()));
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(module.exports.profil(message,sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()))

                })
                .catch(collected => {
                })
            }

        } else {
            //Cas dans les channels publics
            //               chan commande trinité                               category staff trinité                          log trinité                                 remake.js                                              
            if (!(message.channel.id == "763773759848972318" || message.channel.parentID == "734362818140307466" || message.guild.id == "767084336737943582" || message.guild.id == "595989063111278592" || message.guild.id == "618079696575528995")) return;

            if (args[1] == "ban") {
                if (message.guild.member(message.author).roles.highest.comparePositionTo(message.guild.roles.cache.get("734382679914709013")) < 0) return message.channel.send("Vous n'avez pas la permition de faire cela !")
                let id = message.mentions.users.first()
                if (!id) return message.channel.send("Il n'y a pas de mention");

                //On avait un user avant
                id = id.id


                let db = sql.prepare(`SELECT ban FROM profil WHERE id=${id}`).get();
                if(!db) return message.channel.send("La personne n'a pas de profil !");
                sql.prepare(`UPDATE profil SET ban = ? WHERE id = ${id}`).run(1);
                message.channel.send("Ban !")
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("785079504536076309").send(`${message.author} a ban ${message.mentions.users.first()} ${message.mentions.users.first().username}`);
            }else if (args[1] == "unban") {
                if (message.guild.member(message.author).roles.highest.comparePositionTo(message.guild.roles.cache.get("734382679914709013")) < 0) return message.channel.send("Vous n'avez pas la permition de faire cela !")
                let id = message.mentions.users.first()
                if (!id) return message.channel.send("Il n'y a pas de mention");

                //On avait un user avant
                id = id.id


                let db = sql.prepare(`SELECT ban FROM profil WHERE id=${id}`).get();
                if(!db) return message.channel.send("La personne n'a pas de profil !");
                sql.prepare(`UPDATE profil SET ban = ? WHERE id = ${id}`).run(0);
                message.channel.send("Unban")
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("785079504536076309").send(`${message.author} a unban ${message.mentions.users.first()} ${message.mentions.users.first().username}`);
            } else if (args[1] == "set") {
                if (message.author.id != "277100743616364544") return;
                if(!args[2]) return message.channel.send("/p set [mention] [colonne] [new value]")
                sql.prepare(`UPDATE profil SET ${args[3]} = ? WHERE id = ${message.mentions.users.first().id}`).run(args.splice(4).join(" "));
            } else if (!message.mentions.users.first()) {
                let db = sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get();
                if(!db) return  message.channel.send("Il semble que vous n'ayez pas de profil !");
                if(db.ban == 1) return message.channel.send("Tu ne peux plus utiliser cette fonctionnalité.")
                let profil_ = module.exports.profil(message, db)
                message.channel.send(profil_)
            } else if (message.mentions.users.first()) {
                let db = sql.prepare(`SELECT * FROM profil WHERE id=${message.mentions.users.first().id}`).get();
                if(!db) return  message.channel.send("La personne n'a pas de profil !");
                if(db.ban == 1) return message.channel.send("La personne ne peux plus utiliser cette fonction du bot")
                let profil_ = module.exports.profil(message, db)
                message.channel.send(profil_)
            }
            
        }
    },
    profil(message, db) {
        /*let x = ""
        for (let pas = 0; pas < lang.option.length; pas ++) {
            x += `${pas} : ${lang.option[pas]}\\n`
        }
        console.log(x)*/

        //Si l'id est un nombre on recupere la db car c'est l'id
        if (!isNaN(db)) db = sql.prepare(`SELECT * FROM profil WHERE id=${message.author.id}`).get()

        //Embed
        let content = new Discord.MessageEmbed()
        .setTitle(`${lang.civ[db.civ]} ${db.name} ${db.lastname}`)

        //texte d'anniversaire
        let birthday = ""
        if (db.birth_day != 0 && db.birth_year != 0 && db.birth_month != 0) birthday = `Né le ${db.birth_day} ${lang.month[db.birth_month - 1]} ${db.birth_year}`;
        else if (db.birth_day != 0 && db.birth_month != 0) birthday = `Anniversaire le : ${db.birth_day} ${lang.month[db.birth_month - 1]}`;
        else if (db.birth_year != 0 && db.birth_month != 0) birthday = `Né en ${lang.month[db.birth_month - 1]} ${db.birth_year}`;
        else if (db.birth_year != 0) birthday = `Né en ${db.birth_year}`;

        //Status
        let status = ""
        if(sql.prepare("SELECT value FROM main WHERE key = ?").get("couple").value == "true") {
            if (db.couple == "1" || db.couple == "2") status = "\nEn couple avec sa main droite"
            else if (db.couple == "0") status = "\nCélibataire"
            else if (db.couple != "-1") {
                //Pas dans le cas ou on affiche rien donc cas avec une personne

                let lover = sql.prepare("SELECT couple, name, lastname FROM profil WHERE id = ?").get(db.couple)
                if(!lover) status = `\nA des sentiments pour une personne inconnue`
                else if (lover.couple != db.id) status = `\nA des sentiment pour ${lover.lastname} ${lover.name}`
                else status = `\nEst en couple avec ${lover.lastname} ${lover.name}`
            }
        }
        

        content
        .setDescription(`${lang.classe[db.class]} ${db.class_number}\n${birthday}${status}`)
        .setColor(db.color)

        //Liste des badges
        if(db.badges == -1) {
            content.addField("\u200B","\u200B")
        } else {
            let r = ""
            for (let i = 0; i < db.badges.split(",").length ; i ++) {
                r = r + `${ require("./badges.json")[db.badges.split(",")[i]].emoji}`
            }
            content.addField(r,"\u200B")
        }

        //Classe
        content
        .addField("Langue Vivante A", lang.lang[db.lva])
        .addField("Langue Vivante B", lang.lang[db.lvb])
        if (db.class == 1) {
            content.addField("Spécialités",`${lang.speciality[db.spe1]}\n${lang.speciality[db.spe2]}\n${lang.speciality[db.spe3]}`)
        }
        if (db.class == 0) {
            content.addField("Spécialités",`${lang.speciality[db.spe1]}\n${lang.speciality[db.spe2]}`)
        }
        let option_txt = ""
        for (let pas = 0; pas < db.option.split(",").length; pas++) option_txt += `\n${lang.option[db.option.split(",")[pas]]}`
        option_txt.trimStart()
        content
        .addField("Option", option_txt)
        .addField("Projet pour l'avenir",db.futur)

        //Photo
        .setThumbnail(message.client.users.cache.get(db.id).displayAvatarURL())

        //citation
        if (db.quote != -1){
            let quote = sql.prepare("SELECT quote, author FROM quote WHERE id=?").get(db.quote)
            content.setFooter(`\u200B\n${quote.quote}\n${quote.author}`)
        }
        return content
    },
    async nom(message,args){
        let testname = /^[a-zA-Zé'è\-_çàüûâäôöîïÿêë. ]{1,30}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre nom est trop long ou contient des caractères non autorisé")
                return answer = 1
            } else {
                sql.prepare(`UPDATE profil SET name = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le nom :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez votre nom de famille")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre nom est trop long ou contient des caractères non autorisé")
                    return answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET name = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le nom :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    },
    async prenom(message, args) {
        let testname = /^[a-zA-Zé'è\-_çàüûâäôöîïÿêë. ]{1,30}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre prénom est trop long ou contient des caractères non autorisé")
                return answer = 1
            } else {
                sql.prepare(`UPDATE profil SET lastname = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le prénom :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez votre prénom")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre prénom est trop long ou contient des caractères non autorisé")
                    return answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET lastname = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le prénom :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Votre prénom est trop long ou contient des caractères non autorisé")
                answer = 2
            })
        }
        return answer
    },
    async civ(message, args) {
        let testname = /^[0-1]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre civilité doit etre représenter par un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET civ = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la civilité :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez le chiffre correspondant à votre civilité :\n0 : Monsieur\n1 : Madame")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre civilité doit etre représenter par un chiffre")
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET civ = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la civilité :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    },
    async couleur(message, args){
        let testname = /^[0-2]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre couleur doit etre représenté par un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET color = ? WHERE id = ${message.author.id}`).run(lang.color[args[2]][1]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la couleur :\n${args[2]}`);
            }
        } else {
            message.channel.send("Choisissez le chiffre de la couleur que vous souhaitez :\n0 : Rouge\n1 : Vert\n2 : Bleu")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre couleur doit etre représenté par un chiffre")
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET color = ? WHERE id = ${message.author.id}`).run(lang.color[collected.first().content][1]);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la couleur :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    },
    async niveau(message, args) {
        let testname = /^[0-3]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre niveau doit etre 2 si vous etes en seconde, 1 en premiere, 0 en terminale et 3 si vous n'etes pas au lycee")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET class = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le niveau :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez le nombre qui vous correspond :\n2 : Vous êtes en seconde\n1 : Vous êtes en premiere\n0 : Vous êtes en terminale\n3 : Vous n'êtes pas au lycée")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre niveau doit etre 2 si vous etes en seconde, 1 en premiere, 0 en terminale et 3 si vous n'etes pas au lycee")
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET class = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le niveau :\n${collected.first().content}`)
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
            return answer
        }
    },
    async classe(message, args) {
        let testname = /^[0-4]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre classe doit etre un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET class_number = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la classe :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez le chiffre de votre classe")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre classe doit etre un chiffre")
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET class_number = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la classe :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    },
    async anniversaire(message, args) {
        let testname = /^(0?[0-9]|[12][0-9]|3[01])[\/](0?[0-9]|1[012])[\/]\d{4}$/;
        const filter = msg => !msg.author.bot
        //penser au fait que les gens veulent pas forcement la montrer
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Le format doit etre jj/mm/aaaa")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET birth_day = ?, birth_month = ?, birth_year = ? WHERE id = ${message.author.id}`).run(args[2].split("/")[0],args[2].split("/")[1],args[2].split("/")[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la naissance :\n${args[2]}`)
            }
        } else {
            message.channel.send("Entrez votre date de naissance jj/mm/aaaa (si vous ne voulez pas afficher le jour le mois ou l'année, placer des 0 au lieu des véritables chiffres")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Le format doit etre jj/mm/aaaa")
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET birth_day = ?, birth_month = ?, birth_year = ? WHERE id = ${message.author.id}`).run(collected.first().content.split("/")[0],collected.first().content.split("/")[1],collected.first().content.split("/")[2]);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la naissance :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            });
        }
        return answer
    },
    async lva (message, args) {
        let testname = /^[0-3]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre langue doit etre représenté par un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET lva = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la premiere langue :\n${args[2]}`)
            }
        } else {
            message.channel.send("Entrez le chiffre de votre premiere langue:\n0 : Anglais\n1 : Allemand\n2 : Espagnol\n3 : Italien")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre langue doit etre représenté par un chiffre")
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET lva = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la premiere langue :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    },
    async lvb(message, args) {
        let testname = /^[0-3]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre langue doit etre représenté par un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET lvb = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la seconde langue :\n${args[2]}`)
            }
        } else {
            message.channel.send("Entrez le chiffre de votre seconde langue :\n0 : Anglais\n1 : Allemand\n2 : Espagnol\n3 : Italien")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre langue doit etre représenté par un chiffre")
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET lvb = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la seconde langue :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    }, 
    async spe1(message, args) {
        let testname = /^[0-9]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre spécialité doit etre représenté par un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET spe1 = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la premiere spe :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez le chiffre de votre premiere spécialité :\n0 : Histoire géographie, géopolitique et sciences politiques\n1 : Science économique et sociale\n2 : Humanités, littérature et philosophie\n3 : Langues, littératures et cultures étrangères\n4 : Anglais Monde Contemporain\n5 : Mathématiques\n6 : Physique Chimie\n7 : Numérique et sciences informatiques\n8 : Science de le vie et de la terre\n9 : Arts")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre spécialité doit etre représenté par un chiffre")
                    answer = 1 
                } else {
                    sql.prepare(`UPDATE profil SET spe1 = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la premiere spe :\n${collected.first().content}`)
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    }, 
    async spe2(message, args) {
        let testname = /^[0-9]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre spécialité doit etre représenté par un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET spe2 = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la seconde spe :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez le chiffre de votre seconde spécialité :\n0 : Histoire géographie, géopolitique et sciences politiques\n1 : Science économique et sociale\n2 : Humanités, littérature et philosophie\n3 : Langues, littératures et cultures étrangères\n4 : Anglais Monde Contemporain\n5 : Mathématiques\n6 : Physique Chimie\n7 : Numérique et sciences informatiques\n8 : Science de le vie et de la terre\n9 : Arts")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre spécialité doit etre représenté par un chiffre")
                    answer = 1 
                } else {
                    sql.prepare(`UPDATE profil SET spe2 = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la seconde spe :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    }, 
    async spe3(message, args) {
        let testname = /^[0-9]{1}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args[2])) {
                message.channel.send("Votre spécialité doit etre représenté par un chiffre")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET spe3 = ? WHERE id = ${message.author.id}`).run(args[2]);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la toisieme spe :\n${args[2]}`);
            }
        } else {
            message.channel.send("Entrez le chiffre de votre troisieme spécialité :\n0 : Histoire géographie, géopolitique et sciences politiques\n1 : Science économique et sociale\n2 : Humanités, littérature et philosophie\n3 : Langues, littératures et cultures étrangères\n4 : Anglais Monde Contemporain\n5 : Mathématiques\n6 : Physique Chimie\n7 : Numérique et sciences informatiques\n8 : Science de le vie et de la terre\n9 : Arts")
            await message.channel.awaitMessages(filter, {max:1, time: rep_time})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Votre spécialité doit etre représenté par un chiffre")
                    answer = 1 
                } else {
                    sql.prepare(`UPDATE profil SET spe3 = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit la toisieme spe :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    },
    async option(message, args) {
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            for (let pas = 0; pas < String(args[2]).split(",").length; pas ++) {
                if (!lang.option[ args[2].split(",")[pas] ]) {
                    message.channel.send("Vous devez envoyez les chiffres de vos options séparér par une virgule ! Erreur : \n" + args[2].split(",")[pas])
                    return answer = 1
                }
                if (pas==5) {
                    message.channel.send("Vous pouvez choisir un maximum de 5 option")
                    return answer = 1
                }
            }
            sql.prepare(`UPDATE profil SET option = ? WHERE id = ${message.author.id}`).run(args[2])
            message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit les options :\n${args[2]}`)
        } else {
            message.channel.send("Entrez les chiffres de vos option séparé par des vigules :\n0 : Aucune\n1 : Latin\n2 : Grec\n3 : Latin-Grec\n4 : Espagnol LV3\n5 : Italien LV3\n6 : Excel in English\n7 : Cervantes\n8 : Goethe\n9 : Allemand DNL\n10 : Bac International (Cosmopole)\n11 : Mathématique Expertes\n12 : Mathématiques Complémentaires\n13 : Comédie Musicale\n14 : E3D\n15 : Musique\n16 : Arts Plastiques\n")
            await message.channel.awaitMessages(filter, {max:1, time: (2 * rep_time)})
            .then(collected => {
                for (let pas = 0; pas < String(collected.first().content).split(",").length; pas ++) {
                    if (!lang.option[ collected.first().content.split(",")[pas] ]) {
                        message.channel.send("Vous devez envoyez les chiffres de vos options séparér par une virgule ! Erreur : \n" + collected.first().content.split(",")[pas])
                        return answer = 1
                    }
                    if (pas==5) {
                        message.channel.send("Vous pouvez choisir un maximum de 5 option")
                        return answer = 1
                    }
                }
                sql.prepare(`UPDATE profil SET option = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit les options :\n${collected.first().content}`);
            })
            .catch(col => {
                message.channel.send("Stop")
                return answer = 2
            })
        }
        return answer
    },
    async futur(message, args) {
        let testname = /^[a-zA-Z0-9é'è_ç\-àüûâäôöîïÿêë/\\=+"&{}()[\]@°!%:?,;<>ß.§ ]{1,140}$/;
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args[2]) {
            if(!testname.test(args.slice(2))) {
                message.channel.send("Le texte sur votre futur doit faire entre 1 et 140 caractères (parmi les caractères autorisés).")
                answer = 1
            } else {
                sql.prepare(`UPDATE profil SET futur = ? WHERE id = ${message.author.id}`).run(args.slice(2).join(" "));
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le futur :\n${args.slice(2).join(" ")}`);
            }
        } else {
            message.channel.send("Vous avez 140 caractères disponibles et deux minutes pour écrire ce que vous voulez faire plus tard (Si vous depassez le temps gardez votre message, vous allez pouvoir modifier votre profil apres) :")
            await message.channel.awaitMessages(filter, {max:1, time: (rep_time * 2)})
            .then(collected => {
                if(!testname.test(collected.first().content)) {
                    message.channel.send("Le texte sur votre futur doit faire entre 1 et 140 caractères (parmi les caractères autorisés).");
                    answer = 1
                } else {
                    sql.prepare(`UPDATE profil SET futur = ? WHERE id = ${message.author.id}`).run(collected.first().content);
                    message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`${message.author} a choisit le futur :\n${collected.first().content}`);
                }
            })
            .catch(col => {
                message.channel.send("Stop")
                answer = 2
            })
        }
        return answer
    },
    delete(message, args) {
        const filter = msg => !msg.author.bot
        let answer = 0

        if(args.splice(1).join(" ").toLowerCase() == "suppression valide") {
            message.client.guilds.cache.get("767084336737943582").channels.cache.get("784480920287707197").send(`:x:${message.author} a supprimer son profil.`)
            sql.prepare(`DELETE FROM profil WHERE id = ${message.author.id}`).run()
            message.channel.send("Votre profil n'existe plus !")
        } else message.channel.send("Si vous souhaitez supprimer votre profil, tapez /p suppression valide")

        return answer
    },
    has_profil(id) {
        let profil = sql.prepare(`SELECT name, lastname FROM profil WHERE id=${id}`).get()
        return profil ? true : false
    },
    read_civ(id) {
        return sql.prepare(`SELECT civ FROM profil WHERE id=${id}`).get().civ
    }
}