const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./trinite.sqlite');


module.exports = async (client, reac, user) => {
    if(reac.message.channel.id == "763800449056505856" && reac.emoji.name == "✅" && Number(sql.prepare("SELECT enter FROM main WHERE id=0").get().enter) == 1 && !reac.message.guild.member(user).roles.cache.has("764927725500235856")) {
        //role eleve
        reac.message.guild.member(user).roles.add("768447235485728788")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`✅ ${user} élèves`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇸" && !reac.message.guild.member(user).roles.cache.has("764927725500235856")) {
        //role seconde
        reac.message.guild.member(user).roles.add("762720116529692703")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`✅ ${user} seconde`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇵" && !reac.message.guild.member(user).roles.cache.has("764927725500235856")) {
        //role premiere
        reac.message.guild.member(user).roles.add("762720071277346846")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`✅ ${user} premiere`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇹" && !reac.message.guild.member(user).roles.cache.has("764927725500235856")) {
        //role terminale
        reac.message.guild.member(user).roles.add("762720018877382666")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`✅ ${user} terminale`)
    } else if(reac.message.id == "768918029764657234" && reac.emoji.name == "🇨" && !reac.message.guild.member(user).roles.cache.has("764927725500235856")) {
        //role terminale
        reac.message.guild.member(user).roles.add("764938642278973451")
        client.guilds.cache.get("767084336737943582").channels.cache.get("768455338868342864").send(`✅ ${user} college`)
    }
};
