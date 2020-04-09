const { MessageEmbed } = require('discord.js');

module.exports = {
    reportMember: async (client, message, args) => {
        if(message.deletable){
            message.delete();
        }

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if(!rMember){
            return message.reply("couldn't find that person").then(m => {
                m.delete(5000);
            })
        }

        if(rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot){
            return message.reply("Can't report that member").then(m => {
                m.delete(5000);
            })
        }

        if(!args[1]){
            return message.channel.send("REPORT FAILED - Please provide a reason for the report!").then(m => m.delete(5000));
        }

        const channel = message.guild.channels.cache.find(channel => channel.name === "bot_test");

        if(!channel) {
            return message.channel.send("I couldn't find a \`#bot_test\` channel").then(m => m.delete(5000));
        }

        const embed = new MessageEmbed()
            .setColor(0xedeff2)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported Member", rMember.user.displayAvatarURL)
            .setDescription(`**>Member:** ${rMember} (${rMember.id})
            **>Reported By:** ${message.member} (${message.member.id})
            **>Reported in: ** ${message.channel}
            **>Reason:** ${args.slice(1).join(" ")}`)

            channel.send(embed);
    }


}