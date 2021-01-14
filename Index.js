//Api discord
const Discord = require('discord.js');
const client = new Discord.Client(intents=Discord.Intents.ALL,{partials:["MESSAGE","GUILD_MEMBER","REACTION"]});
client.commands = new Discord.Collection();

//Module
const fs = require("fs");

//Token
const parametre = require("./paramtre.json")
client.login(parametre[parametre.start_mode]);

//Pour toute les commandes
for (const file of fs.readdirSync('./commands/').filter(file_ => file_.endsWith('.js') && file_.toLowerCase() === file_)) {
	let command = require(`./commands/${file}`);

	
    //Vérif perso
    if(!command.name) return console.log(`La commande n'a pas de nom : ${command}`);
    if(!command.type) return console.log(`La commande : ${command.name} n'a pas de type`);
    if(!command.description) return console.log(`La commande : ${command.name} n'a pas de description`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
    let note = ""
    if(command.note != undefined) note = command.note
    console.info(`${command.type}:${command.name} ${note}`)
}

//Chargement des events liée a discord
fs.readdir('./events/', (error, f) => {
    if (error) return console.error(error);

    console.log(`${f.length} events chargés`);

    f.forEach((f) => {
        let events = require(`./events/${f}`);
        let event = f.split('.')[0];
        client.on(event, events.bind(null, client));
    });
});


/*
console.log(sql.prepare("SELECT welcome FROM main WHERE id=0").get())

// Filtre pour dire si la personne peux recevoir une couleur
    
client.on("message",message => {
    message.channel.send()
})

*/



