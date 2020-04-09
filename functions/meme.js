const { MessageEmbed } = require('discord.js');
const randomPuppy = require("random-puppy");

module.exports = {
    getMeme: async (message) => {
       if(message.deletable){
           message.delete();
       } 

       const subreddits = ["dankmeme", "meme", "me_irl"];
       const random = subreddits[Math.floor(Math.random() * subreddits.length)];
       
       const img = await randomPuppy(random)
       const embed = new MessageEmbed()
            .setColor(0xedeff2)
            .setImage(img)
            .setTitle(`From /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);

        message.channel.send(embed);

    }
}