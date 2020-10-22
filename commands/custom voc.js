function change_name(number) {
    if (number == 2) return "Duo"
    else if (number == 3) return "Trio"
    else if (number == 4) return "Squad"
    else if (number == 5) return "Full"
    else if (number == 10) return "Place"
    else if (number == 0) return "Global"
    else return "Pour " + number

}



module.exports = {
    name:"vocal",
    type:"mod",
    description:"Parametrage des vocaux de jeux",
    args:true,
    usage: "[nb chan a créé:nb personne limite] [nb chan a créé:nb personne limite] ...",
    note:"",
    status:"mod",
    async execute(message, args) {

        message.client.guilds.cache.get("767084336737943582").channels.cache.get("768138686507778088").send(`/vocal ${message.author} ${args.slice(1).join(" ")}`)

        let list = new Map()
        let category = "761872819805224971"
        if (message.guild.id == "767084336737943582") category = "768082375870906369"

        if (args[1] == "add") {
            for (let pas = 2; pas < args.length; pas ++) {
                let text = args[pas].split(":");
                if (text.length != 2) return message.channel.send(`Il y a un probleme avec :\n${args[pas]}`);
                if (!Number.isInteger(Number(text[0])) || Number(text[0]) <= 0 || Number(text[0]) > 30) return message.channel.send("le nombre de channel a créer doit être un entier positif inferieur à 30");
                if (!Number.isInteger(Number(text[1])) || Number(text[1]) < 0 || Number(text[1]) == 1) return message.channel.send("La limite de personne doit être entre 2 et 99");
                list.set(Number(text[1]),Number(text[0]))
            }

            //On compte les channels existant pour numeroté les nouveaux
            let exist = new Map()
            message.guild.channels.cache.each(channel => {
                if (channel.type == "voice" && channel.name.startsWith("『🎮』")) {
                    if (exist.has( Math.abs(channel.userLimit) )) {
                        exist.set(Math.abs(channel.userLimit), exist.get(Math.abs(channel.userLimit)) + 1)
                    } else {
                        exist.set(Math.abs(channel.userLimit), 1)
                    }
                }
            })

            
    
            for (let [k,v] of list.entries()) {
                for (let to_create = 1; to_create < v + 1; to_create ++) {
                    if (!message.guild.channels.cache.find(channel => channel.userLimit == k && channel.name.endsWith(exist.get(k) || 0))) {
                        await message.guild.channels.create(`『🎮』${change_name(k)} #${to_create}`,{
                            parent:message.guild.channels.cache.get(category),
                            type:"voice",
                            userLimit:k,
                        });
                    } else {
                        await message.guild.channels.create(`『🎮』${change_name(k)} #${to_create + (exist.get(k) || 0)}`,{
                            parent:message.guild.channels.cache.get(category),
                            type:"voice",
                            userLimit:k,
                            position:message.guild.channels.cache.find(channel => channel.userLimit == k && channel.name.endsWith(exist.get(k) || 0)).position
                        });
                    }
                }
            }
        }
        else {
            for (let pas = 1; pas < args.length; pas ++) {
                let text = args[pas].split(":");
                if (text.length != 2) return message.channel.send(`Il y a un probleme avec :\n${args[pas]}`);
                if (!Number.isInteger(Number(text[0])) || Number(text[0]) <= 0 || Number(text[0]) > 30) return message.channel.send("le nombre de channel a créer doit être un entier positif inferieur à 30");
                if (!Number.isInteger(Number(text[1])) || Number(text[1]) < 0 || Number(text[1]) == 1) return message.channel.send("La limite de personne doit être entre 2 et 99");
                list.set(Number(text[1]),Number(text[0]))
            }
    
            message.guild.channels.cache.each(chan => {
                if (chan.name.startsWith("『🎮』") && chan.type == "voice") chan.delete()
            })
    
            for (let [k,v] of list.entries()) {
                for (let to_create = 1; to_create < v + 1; to_create ++) {
                    await message.guild.channels.create(`『🎮』${change_name(k)} #${to_create}`,{
                        parent:message.guild.channels.cache.get(category),
                        type:"voice",
                        userLimit:k
                    });
                }
            }
        }

    }
        
}