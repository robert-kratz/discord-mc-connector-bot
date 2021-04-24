const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const manager = require('./db/manager');
const database = require('./db/manager');

client.once('ready', () => {
	console.log('[Bot] Bot started successfully');
});

client.on("message", (event) => {

	if (!event.content.startsWith(config.prefix) || event.author.bot) return;
	if(event.channel.type == "dm") return event.reply(`Please text me on the server`);

	const args = event.content.slice(config.prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if(command === "verify") {
		if(args.length == 1) {
			manager.fetchPlayer(args[0]).then((res) => {
				if(res[0] == undefined || res[0].name === undefined) return event.reply(`This user cannot be verified.`);

				if(event.author.tag != res[0].distag) return event.reply(`You cannot connect this minecraft account to yours.`);

				if(res[0].disid != "null") return event.reply('This account is already verified');

				event.reply('You successfully verified your account, you are now a **' + res[0].role + '**');
				manager.defineDisId(args[0], event.author.id);

				client.guilds.cache.forEach((element) => {
					const role = element.roles.cache.find(role => role.name === res[0].role);
					if(role != undefined) {
						element.members.cache.forEach(memeber => {
							if(memeber.id === event.member.id) {
								memeber.roles.add(role);
							}
						});
					}
				});
			});
		} else {
			event.reply('Please use /verify [minecraftname]');
		}
		return;	
	}
	if(command === "unverify") {
		if(args.length == 0) {
			manager.fetchPlayerFromDisTag(event.author.tag).then((res) => {
				console.log(res);
				if(res[0] == undefined || res[0].name === undefined) return event.reply(`This user cannot be unverified.`);

				if(res[0].disid === "null") return event.reply('This account is not verified yet');

				event.reply('You successfully unverified your account');
				manager.deleteUserTemplate(event.author.id);
			});
		} else {
			event.reply('Please use /verify [minecraftname]');
		}
		return;	
	}
	if(command === "help") {
		event.reply(`**Step 1.** Use join the server and verify yourself\n**Step 2.** Text me /verify [Minecraft Name]`);
		return;	
	}
})

database.connect().then(() => {
	database.createDatabaseProfile();
	client.login(config.bottoken);
});