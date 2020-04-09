module.exports = {
    clear: async (message, args) => {

        if(message.deletable){
            message.delete();
        }

        if(!message.member.hasPermission("MANAGE_MESSAGES")){
            return message.reply("You can't delete messages boy").then(m => m.delete(5000));
        }

        if(isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("That's not a number? What the hell are you doing?").then(m => m.delete(5000));
        }

        if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){
            return message.reply("Sorry, I can't delete messages because somebody won't give me permission, dumbasses").then(m => m.delete(5000));
        }

        let deleteAmount;

        if(parseInt(args[0]) > 100){
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages`))
            .catch(err => message.reply(`Something went wrong... ${err}`));
    }

}