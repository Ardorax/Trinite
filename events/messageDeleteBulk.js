module.exports = async (client, messages) => {
    let hist = ""
    messages.each(msg => {
        hist += `${msg.author} ${msg.author.username} ${msg.content}\n`
    })
    client.guilds.cache.get("767084336737943582").channels.cache.get("768077976478154752").send(hist,{
        split:true
    })
};