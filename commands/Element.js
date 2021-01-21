const Discord = require('discord.js');
const element = require("./element.json")


module.exports = {
    name:"element",
    type:"user",
    description:"Liste des éléments chimiques",
    args:true,
    usage: "[nombre,nom,diminutif]",
    execute(message, args) {

        let num = new Number(args[1])
        let img = args[1]
        let finnum = new Number(args[1])
        let color = 0

        if(isNaN(args[1])) {
            if(img.length >= 3 || img === "Or") {
                finnum = element.nom.indexOf(img)
                if (finnum === - 1) return message.channel.send("Non trouvé")
                num = finnum + 1
                img = num + 1
                finnum = finnum + 1
            } else {
                finnum = element.symb.indexOf(img)
                if (finnum === - 1) return message.channel.send("Non trouvé")
                num = finnum + 1
                img = num + 1
                finnum = finnum + 1
            }
        }

        let infoelement = new Discord.MessageEmbed()
        .setColor(0x0d16cf)
        .setTitle("Tableau periodique des elements")
        .setDescription("Numero " + finnum)
        .addField("Nom",element.nom.slice(num - 1, num),true)
        .addField("Symbole Chimique",element.symb.slice(num - 1, num),true)
        .addField("Masse atomique",element.mato.slice(num - 1, num),true)
        .addField("Masse volumique",element.mvol.slice(num - 1, num),true)
        .addField("Temperature de fusion",element.fusion.slice(num - 1, num),true)
        .addField("Temperature d'ébulition",element.ebul.slice(num - 1, num),true)
        .addField("Date de découverte",element.date.slice(num - 1, num),true)
        .addField("Decouvert par",element.hum.slice(num - 1, num),true)

        message.channel.send(infoelement)
    } 
}



