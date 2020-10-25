const Discord = require('discord.js');
module.exports = async (client, reac, user) => {
    if(reac.message.id == "763800773250514985" && reac.emoji.name == "✅") {
        //role eleve
        reac.message.guild.member(user).roles.remove("768447235485728788")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} ${message.author.username} eleve`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇸") {
        //role seconde
        reac.message.guild.member(user).roles.remove("762720116529692703")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} ${message.author.username} seconde`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇵") {
        //role premiere
        reac.message.guild.member(user).roles.remove("762720071277346846")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} ${message.author.username} premiere`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇹") {
        //role terminale
        reac.message.guild.member(user).roles.remove("762720018877382666")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} ${message.author.username} terminale`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇨") {
        //role terminale
        reac.message.guild.member(user).roles.remove("764938642278973451")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`:x: ${user} ${message.author.username} college`)
    }
};
