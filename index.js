
// Extract the required classes from the discord.js module
const { Client, MessageEmbed } = require('discord.js');

// Create an instance of a Discord client
const client = new Client({
    disableEveryone: true
});

//pull in message prefix and token from config file
const { prefix, token } = require('./config.json');

const { getMember, formatDate } = require('./functions/getInfo.js');
const { reportMember } = require('./functions/reports.js');
const { flip } = require('./functions/flip.js');
const { getMeme } = require('./functions/meme.js');
const { clear } = require('./functions/clearMessages.js');
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg")
const { stripIndents } = require("common-tags");

let servers = {};

client.on("ready", async () => {
    
    console.log(`Hi, ${client.user.username} is now online!`);

    let smile = '\u{1F600}';

    client.user.setActivity(`all of you ` + smile, {type: 'WATCHING'});
})

client.on('message', async message => {

    let user = message.member;
 
    console.log(user.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']))

    if(message.content.includes("fuck") && message.author.username !== "kickBot"){
        message.channel.send("fuck you too " + message.author.username + "!");
    }

    if(message.content.startsWith(`${prefix}kick`)) {
        if(message.author.username !== "SenorBob"){
            message.channel.send("You ain't kicking nobody");
        } else {
            let member = message.mentions.members.first();
            member.kick().then((member) => {
                message.channel.send("Adios");
            });
        }
    } else if(message.content.startsWith(`${prefix}kick`)){
        if(message.author.username !== "SenorBob"){
            message.channel.send("You ain't banning nobody");
        } else {
            let member = message.mentions.members.first();
            member.ban().then((member) => {
                message.channel.send("Adios");
            })
        }
    }

    if(message.author.username === "Nut Punch Wizard") {
        let clown = '\u{1F921}';
        message.react(clown)
    }


    if(!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log("args are: " + args + "\ncommand is: " + command);

    if(command === "help"){
        const embed = new MessageEmbed()
            .setTitle("Help Info")
            .setColor(0xedeff2)
            .addField("**!ping:**", "Gives the latency to the discord API server and back", false)
            .addField("**!embed \"your message\":**", "Has the bot set a new embeded message in the same server that command was invoked from", false)
            .addField("**!report \"reason for reporting\":**", "Has the bot send a embeded report message with given reason", false)
            .addField("**!info | !info @\"discord username\":**", "Has the bot send an embedded message with info on either yourself (no name specified) or the specified person", false)
            .addField("**!flip:**", "Gives a random heads or tails option", false)
            .addField("**!meme:**", "Posts a random meme from one of a few different subreddits", false)
            .addField("**!clear \"number of messages to clear\"**:", "Deletes the specified number of messages from the channel in which the command was invoked", false)
            .addField("**!kick | !ban:**", "A power that you degenerates cannot be trusted with", false)
            .setFooter(message.author.username, client.user.displayAvatarURL)
            .setTimestamp();

            message.channel.send(embed);
    }

    if(command === "ping") {
       const msg = await message.channel.send("Pinging...");
       
       msg.edit(`🏓 Pong!\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`);    
    }

    if(command === "embed") {
        message.delete();

        if(args.length === 0) {
            return message.reply("Nothing to embed?").then(m => m.delete(5000));
        }

        const embed = new MessageEmbed()
            .setTitle('Attention!')
            .setColor(0xedeff2)
            .setDescription(args.join(" "))
            .setTimestamp()
            .setFooter(message.author.username, client.user.displayAvatarURL);

        // Send the embed to the same channel as the message
        message.channel.send(embed);
    }

    if(command === "report") {
        reportMember(client, message, args);
    }
    
    if(command === "info"){
        message.delete();

        const userID = args.join(" ");
        let member = getMember(message, args.join(" "));

        //Member variables
        const joined = formatDate(member.user.joinedAt);

        let roles = "| ";
        member.roles.cache.forEach((item) => {
            roles = roles + item.name + " | "
        })


        //User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.avatarURL)
            .setColor(0xedeff2)
           
            .addField('**Member information**:', `**>Display name**: ${member.displayName} \n
                **>Joined at**: ${joined} \n
                **>Roles**: ${roles}`, true)

            .addField('**User Information**:', `**>ID**: ${member.user.id} \n 
                **>Username**: ${member.displayName} \n 
                **>Tag**: ${member.user.tag} \n 
                **>Created At**: ${created}`, true)

            .setTimestamp()

        if (member.user.presence.activities) {
            embed.addField('Currently Playing:', `${member.user.presence.activities}`);
        }
            message.channel.send(embed);
    }

    if(command === "flip") {
        flip(message);
    }

    if(command === "meme") {
        getMeme(message);
    }

    if(command === "clear") {
        clear(message, args);
    }

    if(command === "play" || command === "pause" || command === "clear" || command === "stop"){

        if(message.deletable){
            message.delete();
        }

        function play(connection, message) {
            let server = servers[message.guild.id];

            console.log(server);
            console.log("First link is: " + server.queue[0]);

            server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
           
            server.queue.shift();

            server.dispatcher.on("end", function(){
                if(server.queue[0]){
                    play(connection, message);
                } else {
                    connection.disconnect();
                }
            })
        }
        console.log(args);
        console.log("In voice channel? " + message.member.voice.channel);
        console.log("message.member: " + message.member);

        if(command === "play"){
            if(!args[0]){
                message.channel.send("You need to supply a link dumbass");
            } else if(!message.member.voice.channel){
                message.channel.send("You must be in a voice channel you absolute mong");
            } else {
                if(!servers[message.guild.id]){
                    servers[message.guild.id] = {
                        queue: []
                    }
                }
    
                let server = servers[message.guild.id];
    
                server.queue.push(args[0]);
    
                if(!message.guild.voiceConnection){
                    message.member.voice.channel.join().then(function(connection){
                        play(connection, message);
                    })
                }
            }
        }
    }

})

client.login(token);