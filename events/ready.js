module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status:"online",
        activity : {
            name:"rendre le monde meilleur",
            type:"COMPETING"
        }
    })
    client.guilds.cache.get("767084336737943582").channels.cache.get("768078226723176489").send(`Je me connecte`)
    client.guilds.cache.get("767084336737943582").channels.cache.get("768165464492343296").messages.fetch({limit:3})
    client.guilds.cache.get("734359515788476417").channels.cache.get("763800449056505856").messages.fetch({limit:10})
    client.guilds.cache.get("734359515788476417").channels.cache.get("762047438890467328").messages.fetch({limit:10})
}

