const Discord = require('discord.js');
module.exports = async (client, reac, user) => {
    if(reac.message.id == "763800773250514985" && reac.emoji.name == "✅") {
        //role eleve
        reac.message.guild.member(user).roles.remove("768447235485728788")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} eleve`)
    } else if(reac.message.id == "762726512330801193" && reac.emoji.name == "🇸") {
        //role seconde
        reac.message.guild.member(user).roles.remove("762720116529692703")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} seconde`)
    } else if(reac.message.id == "762726083828908083" && reac.emoji.name == "🇵") {
        //role premiere
        reac.message.guild.member(user).roles.remove("762720071277346846")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} premiere`)
    } else if(reac.message.id == "762725615186477056" && reac.emoji.name == "🇹") {
        //role terminale
        reac.message.guild.member(user).roles.remove("762720018877382666")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} terminale`)
    }
};
