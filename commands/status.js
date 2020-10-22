module.exports = {
    name:"status",
    type:"mod",
    description:"Supression de message",
    args:true,
    usage: "[nb_de_msg_a_suppr]",
    note:"",
    owner:true,
    execute(message, args) {
        if (args[1] == "info") return message.channel.send("/status [status] [activity_type] [name of activity]")
        message.client.user.setPresence({
            status:args[1],
            activity : {
                name:args.splice(3).join(" "),
                type:args[2]
            }
        })
    }
        
}