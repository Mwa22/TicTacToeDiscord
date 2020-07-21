const Board = require("./Board");
const Player = require("./Player");
const PlayerType = require("./PlayerType");
const SquareType = require("./SquareType");

/**
 * A room of the game.
 */
module.exports = class Room {

	/**
	 * Initialize the room.
	 * 
	 * @param {GuildMember} - the first player.
	 * @param {GuildMember} - the second player (null if bot).
	 * @param {PlayerType} - the second player type (human or bot).
	 */
	constructor(firstPlayer, secondPlayer, secondType) {
		this._board = new Board();
		this._players = [
			new Player(firstPlayer, PlayerType.HUMAN),
			new Player(secondPlayer, secondType)
		];
		this._currentPlayer = (secondType === PlayerType.HUMAN)? Math.floor(Math.random() * 2) : 0;

		this.currentPlayer.squareType = SquareType.X;
		this.opponentPlayer.squareType = SquareType.O;
	}

	/**
	 * Get the board.
	 * 
	 * @returns {Board} - the board.
	 */
	getBoard() {
		return this._board;
	}
	
	/**
	 * Get the current player.
	 * 
	 * @returns {Player} - the current player.
	 */
	get currentPlayer() {
		return this._players[this._currentPlayer];
	}

	/**
	 * Get the opponent player.
	 * 
	 * @returns {Player} - the opponent player.
	 */
	get opponentPlayer() {
		return this._players[(this._currentPlayer+1)%2];
	}

	/**
	 * Get the players.
	 * 
	 * @returns {Array<Player>} - the players.
	 */
	get players() {
		return this._players;
	}

	/**
	 * A player play.
	 * 
	 * @param {number} pos - the position to play.
	 * @throws {Error} - if the position is invalid.
	 * @returns {Promise} - when played.
	 */
	play(pos) {
		if (pos < 0 || pos > 8)
			throw new Error("The position is invalid.");
		if (!this._board.getFree().includes(pos))
			throw new Error("The given position is not free.");

		return new Promise((resolve, reject) => {
			this._board.setSquare(Math.floor(pos%3), Math.floor(pos/3), (this._currentPlayer === 0)? SquareType.X : SquareType.O);

			if (!this.isOver()) {
				this.swapPlayer();

				// Bot's turn.
				if (this._players[this._currentPlayer].type === PlayerType.EASY_BOT) {
					this.play(this._board.getFree()[0]);
				}
				else if (this._players[this._currentPlayer].type === PlayerType.RANDOM_BOT) {
					const free = this._board.getFree();
					this.play(free[Math.floor(Math.random() * free.length)]);
				}
				else if (this._players[this._currentPlayer].type === PlayerType.CHEAT_BOT) {
					this.play(this._minimax(this._board, 0, -Infinity, Infinity, true));
				}
			}

			resolve();
		});
	}

	/**
	 * Minimax algorithm.
	 * 
	 * @param {Board} board - the board.
	 * @param {number} depth - the depth.
	 * @param {number} alpha - alpha.
	 * @param {number} beta - beta.
	 * @param {boolean} isMaximizer - is maximizer.
	 * 
	 * @returns {number} - in the end the best position to play.
	 */
	_minimax(board, depth, alpha, beta, isMaximizer) {

		if (this.isOver(board)) {
			const winner = this._getSquareTypeWinner(board);
			if (winner === null)
				return 0;
			else if (winner === this.currentPlayer.squareType)
				return 10 - depth;
			else
				return -10 + depth;
		}

		if (isMaximizer) {
			let maxEval = -Infinity;
			let bestPos;
			for (let pos of board.getFree()) {
				// Copy the board.
				let copy = board.copy();
				copy.setSquare(Math.floor(pos%3), Math.floor(pos/3), this.currentPlayer.squareType);

				let currentEval = this._minimax(copy, depth+1, alpha, beta, false);

				if (currentEval > maxEval) {
					maxEval = currentEval;
					bestPos = pos;
				}
				alpha = Math.max(alpha, currentEval);
				if (beta <= alpha)
					break;
			}

			if (depth === 0) {
				return bestPos;
			}
			return maxEval;
		}
		else {
			let minEval = Infinity;
			for (let pos of board.getFree()) {
				// Copy the board.
				let copy = board.copy();
				copy.setSquare(Math.floor(pos%3), Math.floor(pos/3), this.opponentPlayer.squareType);

				let currentEval = this._minimax(copy, depth+1, alpha, beta, true);
				minEval = Math.min(currentEval, minEval);
				beta = Math.min(beta, currentEval);
				if (beta <= alpha)
					break;
			}

			return minEval;
		}
	}

	/**
	 * Play a random pos.
	 * 
	 * @returns {Promise} - when played.
	 */
	passTurn() {
		const free = this._board.getFree();
		return this.play(free[Math.floor(Math.random() * free.length)]);
	}

	/**
	 * Swap the player.
	 */
	swapPlayer() {
		this._currentPlayer = (this._currentPlayer+1) % this._players.length;
	}

	/**
	 * Game is over.
	 * 
	 * @param {Board} - a board.
	 * @returns {boolean} - true if the game is over.
	 */
	isOver(board) {
		if (board === undefined)
			board = this._board;
		return board.getFree().length === 0 || this._getSquareTypeWinner(board) !== null;
	}

	/**
	 * Get the type of square who wins.
	 * 
	 * @param {Board} - a board.
	 * @returns {SquareType} - the square type (null if no winner).
	 */
	_getSquareTypeWinner(board) {
		if (board === undefined)
			board = this._board;

		let type = null;
		
		const squares = board._squares;

		for (let i=0; i < 3; i++) {
			// Horizontal.
			if (!squares[i][0].isEmpty() && squares[i][0].type === squares[i][1].type && squares[i][0].type === squares[i][2].type)
				type = squares[i][0].type;
			// Vertical.
			if (!squares[0][i].isEmpty() && squares[0][i].type === squares[1][i].type && squares[0][i].type === squares[2][i].type)
				type = squares[0][i].type;
		}

		// Diagonal.
		if (!squares[0][0].isEmpty() && squares[0][0].type === squares[1][1].type && squares[0][0].type === squares[2][2].type)
			type = squares[0][0].type;
		// Anti-Diagonal.
		if (!squares[0][2].isEmpty() && squares[0][2].type === squares[1][1].type && squares[0][2].type === squares[2][0].type)
			type = squares[0][2].type;

		return type;
	}

	/**
	 * Get the winner.
	 * 
	 * @returns {Player} - the player (null if equality).
	 */
	getWinner() {
		if (!this.isOver())
			throw new Error("Cannot get the winner while the game is in progress.");

		const typeWinner = this._getSquareTypeWinner();
		if (typeWinner === null) return null;
		return (this._players[0].type === typeWinner)? this._players[0] : this._players[1];
	}
}