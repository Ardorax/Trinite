const Discord = require('discord.js');
module.exports = async (client, start,end) => {
    if (end.partial) {
        await end.fetch()
        client.guilds.cache.get("767084336737943582").channels.cache.get("768077780516601877").send(`Ancien message modifié ${end.author} ${end.channel.name} ${end.id} ${end.createdAt.toLocaleString()}\n${end.content}`)
    } else {
        client.guilds.cache.get("767084336737943582").channels.cache.get("768077780516601877").send(`${start.author} ${start.author.id}\n${start.content}\n${end.content}`)
    }
};
