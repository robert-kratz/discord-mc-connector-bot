const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const { fetchPlayer } = require('./db/manager');

client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", (event) => {
	console.log(event.content);

	if (!event.content.startsWith(config.prefix) || event.author.bot) return;
	if(event.channel.type != "dm") return event.reply(`please dm me to link your account to the discord server.`);

	const args = event.content.slice(config.prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if(command === "verify") {
		event.reply(`You connected your discord account to your minecraft account`)
		return;	
	}
	if(command === "unverify") {
		event.reply(`You disconnected your discord account to your minecraft account`)
		return;	
	}
	if(command === "help") {
		event.reply(`**Bot Help Page (1/1)**\n
					*Login with your Minecraft Account and type ``/verify ${event.member.id}`` *
					${config.prefix}verify [MINECRAFT-USERNAME]\n
					${config.prefix}unverify\n
					${config.prefix}help Shows this page`);
		return;	
	}
})

client.login(config.bottoken);