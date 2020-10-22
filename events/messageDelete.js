module.exports = async (client, message) => {

    if (message.partial) return client.guilds.cache.get("767084336737943582").channels.cache.get("768077587305988097").send(`Ancien message supprimé id : ${message.id}`)
    if(message.author.id == "767082620374614017") return;
    client.guilds.cache.get("767084336737943582").channels.cache.get("768077587305988097").send(`${message.author} ${message.author.id}\n${message.content}`)

    const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first())
    let user = ""
      if (entry.extra.channel.id === message.channel.id
        && (entry.target.id === message.author.id)
        && (entry.createdTimestamp > (Date.now() - 5000))
        && (entry.extra.count >= 1)) {
      user = entry.executor
    } else { 
      user = message.author
    }
    client.guilds.cache.get("767084336737943582").channels.cache.get("768077733141020694").send(`${user} ${message.channel.name}\n${message.content || "aucun contenu"}`);
};