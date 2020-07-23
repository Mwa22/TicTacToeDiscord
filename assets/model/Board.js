const Square = require("./Square");
const SquareType = require("./SquareType");

/**
 * A board of the game.
 */
module.exports = class Board {

	/**
	 * Initialize the board.
	 */
	constructor() {
		this._size = 3;

		this._squares = [
			[new Square(), new Square(), new Square()],
			[new Square(), new Square(), new Square()],
			[new Square(), new Square(), new Square()]
		];
	}

	/**
	 * Get the size of the board.
	 * 
	 * @returns {number} - the size of the board.
	 */
	get size() {
		return this._size;
	}

	/**
	 * Set a square's type.
	 * 
	 * @param {number} x - the x pos of a square (0 to 2).
	 * @param {number} y - the y pos of a square (0 to 2).
	 * @param {SquareType} type - the type of the square.
	 * @throws {Error} - if one of the params is invalid.
	 * @throws {Error} - if the square is not empty.
	 */
	setSquare(x, y, type) {
		if (isNaN(x) || x < 0 || x >= this._size) 
			throw new Error("X pos of the square invalid.");
		if (isNaN(y) || y < 0 || y >= this._size) 
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
	 * @param {number} y - the y pos of a square (0 to 2).
	 * @throws {Error} - if one of the params is invalid.
	 * @returns {Square} - the square.
	 */
	getSquare(x, y) {
		if (isNaN(x) || x < 0 || x >= this._size) 
			throw new Error("X pos of the square invalid.");
		if (isNaN(y) || y < 0 || y >= this._size) 
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
		for (let y=0; y < this._size; y++) {
			for (let x=0; x < this._size; x++) {
				if (this._squares[y][x].isEmpty())
					free.push(y*this._size+x);
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
		for (let y=0; y < this._size; y++) {
			for (let x=0; x < this._size; x++) {
				copy._squares[y][x] = new Square();
				if (!this.getSquare(x, y).isEmpty())
					copy._squares[y][x].setType(this.getSquare(x, y).type);
			}
		}
		return copy;
	}
}