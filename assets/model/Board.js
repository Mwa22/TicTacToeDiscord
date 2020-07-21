const Square = require("./Square");
const SquareType = require("./SquareType");

/**
 * A board of the game.
 */
module.exports = class Board {

	constructor() {
		this._squares = [
			[new Square(), new Square(), new Square()],
			[new Square(), new Square(), new Square()],
			[new Square(), new Square(), new Square()]
		];
	}

	/**
	 * Set a square's type.
	 * 
	 * @param {number} x - the x pos of a square (0 to 2).
	 * @param {number} y - the x pos of a square (0 to 2).
	 * @param {SquareType} type - the type of the square.
	 * @throws {Error} - if one of the params is invalid.
	 * @throws {Error} - if the square is not empty.
	 */
	setSquare(x, y, type) {
		if (isNaN(x) || x < 0 || x > 2) 
			throw new Error("X pos of the square invalid.");
		if (isNaN(y) || y < 0 || y > 2) 
			throw new Error("Y pos of the square invalid.");
		if (type === SquareType.EMPTY)
			throw new Error("Cannot set the value of a square as empty.");
		if (!this._squares[y][x].isEmpty())
			throw new Error("The square is not empty.");
		if (type !== SquareType.O && type !== SquareType.X)
			throw new Error("Invalid type of square.");

		this._squares[y][x].setType(type);
	}

	/**
	 * Get a square.
	 * 
	 * @param {number} x - the x pos of a square (0 to 2).
	 * @param {number} y - the x pos of a square (0 to 2).
	 * @throws {Error} - if one of the params is invalid.
	 * @returns {Square} - the square.
	 */
	getSquare(x, y) {
		if (isNaN(x) || x < 0 || x > 2) 
			throw new Error("X pos of the square invalid.");
		if (isNaN(y) || y < 0 || y > 2) 
			throw new Error("Y pos of the square invalid.");

		return this._squares[y][x];
	}

	/**
	 * Get all the free squares.
	 * 
	 * @returns {Array<number>} - the position of the free squares.
	 */
	getFree() {
		let free = [];
		for (let y=0; y < this._squares.length; y++) {
			for (let x=0; x < this._squares[y].length; x++) {
				if (this._squares[y][x].isEmpty())
					free.push(y*3+x);
			}
		}
		return free;
	}

	/**
	 * Copy the board.
	 * 
	 * @returns {Board} - a copy of the board.
	 */
	copy() {
		let copy = new Board();
		for (let y=0; y < 3; y++) {
			for (let x=0; x < 3; x++) {
				copy._squares[y][x] = new Square();
				if (!this.getSquare(x, y).isEmpty())
					copy._squares[y][x].setType(this.getSquare(x, y).type);
			}
		}
		return copy;
	}
}