const { MessageEmbed } = require('discord.js');

module.exports = {
    flip: (message) => {

        if(message.deletable) {
            message.delete();
        }
        
        const random = Math.random() * 100;
        
        let result = "";

        random < 50 ? result = "heads" : result = "tails";
        
        const embed = new MessageEmbed()
            .setColor(0xedeff2)
            .setTimestamp()
            .setDescription("Result: " + result + "!")
            .setFooter(message.member.displayName)

        message.channel.send(embed);

    }
}