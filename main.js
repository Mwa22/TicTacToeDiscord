const Discord = require("discord.js");
const config = require("config");

const client = new Discord.Client();

client.on("ready", () => {
	console.log("Logged in as");
	console.log(client.user.tag);
	console.log("------");
});

const controller = require("./assets/controller/Controller");

client.on("message", message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(config.get("prefix"))) return;
	if (message.channel.type === "dm") return;

	let args = message.content.substr(config.get("prefix").length, message.content.length);
	args = args.trim().split(" ");
	let command = args.shift().toLowerCase();

	if (command === "tictactoe" || command === "ttt" || command === "oxo") {
		controller.newRoom(message.channel, message.member, message.mentions.members.first());
	}

	if (command === "stop") {
		controller.stop(message.channel);
	}

	if (command === "help" || command === "h") {
		controller.help(message.channel, client.user);
	}
});

client.login(config.get("token"));