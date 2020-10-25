const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
module.exports = (client, message) => {
    //Si c'est un bot qui fait la cmd
    if (message.author.bot) return;

    //gestion des fichiers joints
    if (message.attachments.first() && message.author.id != "767082620374614017") {
        client.guilds.cache.get("767084336737943582").channels.cache.get("768079732486307840").send(`${message.author} ${message.author.username} ${message.channel.name}`,{
            files:[message.attachments.first().url]
        })
    }

	const args = message.content.slice(1).split(/ +/);
	const commandName = args[0].toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if(!command) return;

    //Si c'est une de mes cmd
    if(command.owner && message.author.id !== "277100743616364544") return;

    //Si c'est une cmd faite sur le serv trinité
    if (message.guild.id == "734359515788476417") {
        if (command.status == "mod") {
            if (message.guild.member(message.author).roles.highest.comparePositionTo(message.guild.roles.cache.get("734382679914709013")) < 0) return message.channel.send("Vous n'avez pas la permition de faire cela !")
        }
    }

    //Si on doit donner des arguments
    if(command.args && args.length == 1) {
        let reply = "Il n'y a pas d'arguments fournies ! "

        if(command.usage) reply += `La commande doit s'executé de la maniere suivante : /${command.name} ${command.usage}`

        return message.channel.send(reply)
    }

    //Si cette commande s'utilise uniquement sur une guild
    if(command.guildOnly && message.channel.type != "text") return message.channel.send("Cette commande doit être executé uniquement sur un serveur !")

    //Cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
		    return message.reply(`Il reste ${timeLeft.toFixed(1)} seconde(s) pour executer la commande : \`${command.name}\``);
	    }
    }

    if (message.author.id != "277100743616364544") timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


    try {
	    command.execute(message, args);
    } catch (error) {
	    console.error(error);
	    message.reply('Je suis désolé, une erreur c\'est produite.');
    }
};
