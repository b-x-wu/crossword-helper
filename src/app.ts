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


crossword.mutateSquareAtPosition({x: 1, y: 1}, SquareValue.DARK_SQUARE)
console.log(crossword.getHorizontalWord(crossword.getSquareAt({x:2, y:1})))

// console.log(crossword.getVerticalWord(crossword.getSquareAt(1, 1).down ?? crossword.getSquareAt(0,0)))
// crossword.mutateSquareAtPosition({x: 1, y: 1}, SquareValue.Z)

crossword.displayBoard()
// crossword.displayDictionaries()
