const express = require('express');
const Discord = require('discord.js');
const roblox = require('noblox.js');
const got = require('got');
const db = require('./db.js');
const client = new Discord.Client();
const app = express();

setInterval(function() {
  got("DIRECT GLITCH URL");
}, 240000);

app.get(`/`, async (request, response) => {
     response.sendStatus(200);
});

app.get(`/${process.env.subURLForGettingBans}`, async (request, response) => {
     let bans = await db.get("bans") || [];
     response.send(bans);
});

app.get("/get-username-from-id", async (request, response) => {
     let id = request.query.id;
     response.send(await roblox.getUsernameFromId(id));
});

let listener = app.listen(process.env.PORT, () => {
     console.log('Your app is currently listening on port: ' + listener.address().port);
});

class Ban {
  constructor(uID, reason) {
    this._userID = uID;
    this._reason = reason;
  }
  get userID() {
    return this._userID;
  }
  get reason() {
    return this._reason;
  }
}

client.on("ready", async () => {
     console.log("Logged in the Discord bot account");
});

client.on("message", async message => {
     if(message.author.bot) return;
     if(!message.content.startsWith(process.env.prefix)) return;
     const args = message.content.slice(process.env.prefix.length).split(' ');
     const command = args.shift().toLowerCase();
     if(command === "help") {
       let embed = new Discord.MessageEmbed();
       embed.setColor("BLUE");
       embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
       embed.setTitle("Help Embed");
       embed.setDescription("**ban <username> [reason]** - Bans someone from the linked place\n**listbans** - Lists all the banned accounts that is banned using this bot\n**unban <username>** - Unbans someone from the linked game\n**setreason <username> [new reason]** - Sets a new reason for this user's ban");
       embed.setFooter("Command created by zachariapopcorn#8105, have a nice day!");
       return message.channel.send(embed);
     }
     if(command === 'ban') {
       if(!message.member.roles.cache.find(role => [process.env.banPermsRole].includes(role.name))) {
         return message.channel.send("No permission");
       }
       let username = args[0];
       if(!username) {
         return message.channel.send("You didn't supply a username for me to ban");
       }
       let id
       try {
         id = await roblox.getIdFromUsername(username);
       } catch {
         return message.channel.send("Invalid username supplied");
       }
       let reason = args.splice(1).join(" ");
       if(!reason) {
         reason = 'No reason supplied';
       }
       let bans = await db.get("bans") || [];
       for(var i = 0; i < bans.length; i++) {
         if(bans[i]._userID == id) {
           return message.channel.send("User already banned");
         }
       }
       let newBan = new Ban(id, reason);
       bans.push(newBan);
       await db.set("bans", bans);
       let embed = new Discord.MessageEmbed();
       embed.setColor("BLUE");
       embed.setAuthor(message.author.id, message.author.displayAvatarURL());
       embed.setTitle("Success");
       embed.setDescription(`Success! I have successfully added **${await roblox.getUsernameFromId(id)}** to the ban database`);
       embed.setFooter("Command created by zachariapopcorn#8105, have a nice day!");
       return message.channel.send(embed);
     }
     if(command === 'listbans') {
       if(!message.member.roles.cache.find(role => [process.env.banPermsRole].includes(role.name))) {
         return message.channel.send("No permission");
       }
       let bans = await db.get("bans") || [];
       let embed = new Discord.MessageEmbed();
       embed.setColor("BLUE");
       embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
       embed.setTitle("Bans");
       embed.setDescription("Listing all bans in the field below");
       let fString = "";
       for(var i = 0; i < bans.length; i++) {
         fString += `Name: ${await roblox.getUsernameFromId(bans[i]._userID)} | ID: ${bans[i]._userID} | Reason: ${bans[i]._reason}\n`
       }
       if(fString === "") {
         embed.addField('Bans', 'NONE');
         embed.setFooter("Command created by zachariapopcorn#8105, have a nice day!");
         return message.channel.send(embed);
       }
       embed.addField('Bans', fString);
       embed.setFooter("Command created by zachariapopcorn#8105, have a nice day!");
       return message.channel.send(embed);
     }
     if(command === 'unban') {
       if(!message.member.roles.cache.find(role => [process.env.banPermsRole].includes(role.name))) {
         return message.channel.send("No permission");
       }
       let username = args[0];
       if(!username) {
         return message.channel.send("You didn't supply a username for me to unban");
       }
       let id
       try {
         id = await roblox.getIdFromUsername(username);
       } catch {
         return message.channel.send("Invalid username supplied");
       }
       let bans = await db.get("bans") || [];
       let index = -1;
       for(var i = 0; i < bans.length; i++) {
         if(bans[i]._userID == id) {
           index = i;
         }
       }
       if(index == -1) {
         return message.channel.send("User supplied isn't banned");
       }
       bans.splice(index, index + 1);
       await db.set("bans", bans);
       let embed = new Discord.MessageEmbed();
       embed.setColor("BLUE");
       embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
       embed.setTitle("Success!");
       embed.setDescription(`Success! I have successfully unbanned **${await roblox.getUsernameFromId(id)}** from the linked game`);
       embed.setFooter("Command created by zachariapopcorn#8105, have a nice day!");
       return message.channel.send(embed);
     }
     if(command === 'setreason') {
       if(!message.member.roles.cache.find(role => [process.env.banPermsRole].includes(role.name))) {
         return message.channel.send("No permission");
       }
       let username = args[0];
       if(!username) {
         return message.channel.send("You didn't supply a username for me to change the reason of ban for");
       }
       let id
       try {
         id = await roblox.getIdFromUsername(username);
       } catch {
         return message.channel.send("Invalid username supplied");
       }
       let reason = args.splice(1).join(" ");
       if(!reason) {
         reason = 'No reason supplied';
       }
       let bans = await db.get("bans") || [];
       let index = -1;
       for(var i = 0; i < bans.length; i++) {
         if(bans[i]._userID == id) {
           index = i;
         }
       }
       if(index == -1) {
         return message.channel.send("User supplied isn't banned");
       }
       bans[index]._reason = reason;
       await db.set("bans", bans);
       let embed = new Discord.MessageEmbed();
       embed.setColor("BLUE");
       embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
       embed.setTitle("Success");
       embed.setDescription(`Success! I have set **${await roblox.getUsernameFromId(bans[index]._userID)}'s** ban reason to **${reason}**`);
       embed.setFooter("Command created by zachariapopcorn#8105, have a nice day!");
       return message.channel.send(embed);
     }
});

client.login(process.env.token);
