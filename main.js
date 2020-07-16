const Discord = require("discord.js");
const config = require("config");

const client = new Discord.Client();

client.on("ready", () => {
	console.log("Logged in as");
	console.log(client.user.tag);
	console.log("------");
});


client.on("message", message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(config.get("prefix"))) return;

	let args = message.content.substr(config.get("prefix").length, message.content.length);
	args = args.trim().split(" ");
	let command = args.shift().toLowerCase();
});

client.login(config.get("token"));