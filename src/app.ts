import Crossword from "./crossword";
import { SquarePosition, SquareValue } from "./types";

const crossword: Crossword = new Crossword(5, 5)

// fill board with alphabet
for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
        const value: SquareValue = (5 * x + y) + 1
        const position: SquarePosition = {x, y}
        crossword.mutateSquareAtPosition(position, value)
    }
}
console.log('INITIAL BOARD')
crossword.printBoard()
crossword.printDictionary()

console.log('ADDING DARK SQUARE')
crossword.mutateSquareAtPosition({x: 1, y: 1}, SquareValue.DARK_SQUARE)
crossword.printBoard()
crossword.printDictionary()

console.log('REMOVING DARK SQUARE')
crossword.mutateSquareAtPosition({x: 1, y: 1}, SquareValue.Z)
crossword.printBoard()
crossword.printDictionary()
