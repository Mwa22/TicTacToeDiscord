const config = require("config");
const { MessageEmbed } = require("discord.js");
const SquareType = require("../model/SquareType");
const Player = require("../model/Player");
const PlayerType = require("../model/PlayerType");

/**
 * A View of the TicTacToe Game.
 */
class View {

	/**
	 * Send a message to get the players of the game.
	 * 
	 * @param {Channel} channel - the channel.
	 * @param {GuildMember} creator - the creator of the room.
	 * @returns {Promise<Message>} - the message with the reactions of the players.
	 */
	askBot(channel, creator) {
		let msg = channel.send(this._createAskBotEmbed(creator, false));
		msg.then(message => {
			// add default reactions.
			message.react(config.get("easyBot"));
			message.react(config.get("randomBot"));
			message.react(config.get("cheatBot"));
		});
		return msg;
	}

	/**
	 * Time's up.
	 * 
	 * @param {GuildChannel} message - the channel.
	 * @param {GuildMember} creator - the creator of the room.
	 */
	endAskBot(message, creator) {
		message.edit(this._createAskBotEmbed(creator, true));
	}

	/**
	 * Create an embed message.
	 * 
	 * @param {GuildMember} creator - the creator of the room.
	 * @param {boolean} end - true if the time's up.
	 */
	_createAskBotEmbed(creator, end) {
		let embed = new MessageEmbed()
		.setTitle("Tic Tac Toe")
		.setColor(end? "EA2027" : "2c3e50")
		.setAuthor(creator.displayName, creator.user.displayAvatarURL());

		let botMsg = `Press ${config.get("easyBot")} to play against the easy bot.\n
					Press ${config.get("randomBot")} to play against the random bot.\n
					Press ${config.get("cheatBot")} to play against the cheat bot.`;
		if (end)
			botMsg += "\n\n🚫 Time's up.";

		embed.setDescription(botMsg);
		return embed;
	}

	/**
	 * Send a message to get the players of the game.
	 * 
	 * @param {Channel} channel - the channel.
	 * @param {GuildMember} creator - the creator of the room.
	 * @param {GuildMember} opponent - the opponent.
	 * @returns {Promise<Message>} - the message with the reactions of the players.
	 */
	askOpponent(channel, creator, opponent) {
		let msg = channel.send(this._createAskOpponentEmbed(creator, opponent, false));
		msg.then(message => {
			// add default reactions.
			message.react("🙋‍♂️");
			message.react("🙅‍♂️");
		});
		return msg;
	}

	/**
	 * Time's up.
	 * 
	 * @param {Channel} message - the channel.
	 * @param {GuildMember} creator - the creator of the room.
	 * @param {GuildMember} opponent - the opponent.
	 */
	endAskOpponent(message, creator, opponent) {
		message.edit(this._createAskOpponentEmbed(creator, opponent, true));
	}

	/**
	 * Create an embed message.
	 * 
	 * @param {GuildMember} creator - the creator of the room.
	 * @param {GuildMember} opponent - the opponent.
	 * @param {boolean} end - true if the time's up.
	 */
	_createAskOpponentEmbed(creator, opponent, end) {
		let embed = new MessageEmbed()
		.setColor(end? "EA2027" : "2c3e50")
		.setTitle("Tic Tac Toe")
		.setAuthor(creator.displayName, creator.user.displayAvatarURL());

		let opponentMsg = `⚔️ ${creator.displayName} wants to play against you ${opponent.displayName} !`;
		if (end)
			opponentMsg += "\n\n🚫 Time's up.";

		embed.setDescription(opponentMsg);
		return embed;
	}

	/**
	 * Show the board.
	 * 
	 * @param {Channel} channel - the channel.
	 * @param {Board} board - the board.
	 * @param {Player} player - the current player.
	 * @returns {Promise<Message>} - the message sent.
	 */
	showBoard(channel, board, player) {
		let msg = channel.send(this._createBoardEmbed(board, player));
		msg.then(message => {
			const nums = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
			nums.forEach(num => message.react(num));
		});
		return msg;
	}

	/**
	 * Update the board.
	 * 
	 * @param {Message} message - the message of the board.
	 * @param {Board} board - the board.
	 * @param {Player} player - the current player.
	 * @returns {Promise<Message>} - the message edited.
	 */
	updateBoard(message, board, player) {
		return message.edit(this._createBoardEmbed(board, player));
	}

	/**
	 * Create an embed message of the board.
	 * 
	 * @param {Board} board - the board.
	 * @param {Player} player - the current player.
	 * @returns {MessageEmbed} - the embed message.
	 */
	_createBoardEmbed(board, player) {
		let embed = new MessageEmbed()
		.setColor(3447003)
		//.setTitle(`${player.member.displayName}'s turn.`)
		//.setThumbnail(player.member.user.displayAvatarURL());
		.setTitle((player.type === PlayerType.HUMAN)? `${player.member.displayName}'s turn.` : "Bot's turn.")
		.setThumbnail((player.type === PlayerType.HUMAN)? player.member.user.displayAvatarURL() : "https://scx1.b-cdn.net/csz/news/800/2019/3-robot.jpg");

		let boardMsg = "";
		for (let y=0; y < board.size; y++) {
			for (let x=0; x < board.size; x++) {
				const type = board.getSquare(x, y).type;
				boardMsg += (type === SquareType.O)? ' ‎⭕ ‎' : (type === SquareType.X)? ' ‎❌ ‎' : ` ‎ ‎ ‎${(y*board.size+x)+1} ‎ ‎ ‎`;
				if (x !== board.size-1)
					boardMsg += "|";
			}

			boardMsg += "\n";
			if (y !== board.size-1)
				boardMsg += "----------------\n";
		}

		embed.setDescription(boardMsg);
		
		return embed;
	}

	/**
	 * Show the winner of the room.
	 * 
	 * @param {Channel} channel - the channel.
	 * @param {Player} winner - the winner.
	 */
	showWinner(channel, winner) {
		let embed = new MessageEmbed()
		.setColor("2ecc71")
		.setTitle((winner === null)? "🤜🤛 It's a draw !" : (winner.type !== PlayerType.HUMAN)? `👑 The bot wins !` : `👑 The winner is ${winner.member.displayName} !`);

		channel.send(embed);
	}

	/**
	 * Show an information in the channel.
	 * 
	 * @param {Channel} channel - the channel.
	 * @param {string} info - a message. 
	 */
	showInfo(channel, info) {
		let embed = new MessageEmbed()
		.setColor(3447003)
		.setTitle("ℹ Information")
		.setDescription(info);

		channel.send(embed);
	}

	/**
	 * Show an error in the channel.
	 * 
	 * @param {Channel} channel - the channel.
	 * @param {string} error - an error message. 
	 */
	showError(channel, error) {
		let embed = new MessageEmbed()
		.setColor("EA2027")
		.setTitle("🚫 Error")
		.setDescription(error);

		channel.send(embed);
	}

	/**
	 * Show a help message.
	 * 
	 * @param {Channel} channel - the channel.
	 * @param {User} bot - the bot user.
	 */
	showHelp(channel, bot) {
		let embed = new MessageEmbed()
		.setColor("e67e22")
		.setAuthor(bot.username, bot.displayAvatarURL())
		.setTitle("💡 🇭🇪🇱🇵")
		.setDescription("A tic tac toe game on discord !");

		embed.addField("❗ Commands", 
			`**${config.get("prefix")}tictactoe**, **${config.get("prefix")}ttt**, **${config.get("prefix")}oxo** - to start a game against _a bot_.
			**${config.get("prefix")}tictactoe** __@member__ - to play against _another member of the server_.
			**${config.get("prefix")}stop** - to stop a game.
			**${config.get("prefix")}help**, **${config.get("prefix")}h** - to show this message.`,
			false);
		embed.addField("⚠️ Warnings",
			"You only have one minute to play, otherwise it will play a random position for you and skip your turn.",
			false);

		channel.send(embed);
	}
}

module.exports = new View();