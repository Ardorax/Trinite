module.exports = {
    name:"clear",
    type:"mod",
    description:"Supression de message",
    args:true,
    usage: "[nb_de_msg_a_suppr]",
    note:"",
    status:"mod",
    execute(message, args) {

        //historique a log
        let hist = ""
        message.channel.bulkDelete(Number(args[1]) + 1).then(
            async msg => {
                msg.each(m => hist += `${m.author} ${m.content}\n`)
                message.client.guilds.cache.get("767084336737943582").channels.cache.get("768077976478154752").send(hist,{
                    split:true
                })
            });
    }
        
}