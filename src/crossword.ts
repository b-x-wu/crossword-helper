import { Orientation, Square, SquarePosition, SquareValue, squareValueToString, Word, WordPosition } from './types'
import Dictionary from './dictionary'

export default class Crossword {
    readonly width: number
    readonly height: number
    readonly dictionaries: Map<Orientation, Dictionary>
    private squareArray: Square[][]
    // TODO: add metadata fields

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.squareArray = []
        this.dictionaries = new Map<Orientation, Dictionary>()
        
        this.initializeBoard()
        this.initializeDictionary()
    }

    private initializeBoard(): void {
        for (let y = 0; y < this.height; y++) {
            const row: Square[] = []
            for (let x = 0; x < this.width; x++) {
                row.push({
                    position: {x, y},
                    value: SquareValue.BLANK_SQUARE,
                    left: null,
                    right: null,
                    up: null,
                    down: null,
                })
            }
            this.squareArray.push(row)
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const currentSquare: Square = this.squareArray[y][x]
                if (x - 1 >= 0) { currentSquare.left = this.squareArray[y][x - 1] }
                if (x + 1 < this.width) { currentSquare.right = this.squareArray[y][x + 1] }
                if (y - 1 >= 0) { currentSquare.up = this.squareArray[y - 1][x] }
                if (y + 1 < this.height) { currentSquare.down = this.squareArray[y + 1][x] }
            }
        }
    }

    private initializeDictionary() : void{
        const verticalDictionary: Dictionary = new Dictionary()
        for (let x = 0; x < this.width; x++) {
            const wordPosition: WordPosition = {
                start: {x, y: 0},
                end: {x, y: this.height - 1}
            }
            const word: Word = {
                squareValues: new Array<SquareValue>(this.height).fill(SquareValue.BLANK_SQUARE),
                clue: "",
                length: this.height,
                orientation: Orientation.VERTICAL
            } 
            verticalDictionary.set(wordPosition, word)
        }

        const horizontalDictionary: Dictionary = new Dictionary()
        for (let y = 0; y < this.height; y++) {
            const wordPosition: WordPosition = {
                start: {x: 0, y},
                end: {x: this.width - 1, y}
            }
            const word: Word = {
                squareValues: new Array<SquareValue>(this.width).fill(SquareValue.BLANK_SQUARE),
                clue: "",
                length: this.width,
                orientation: Orientation.HORIZONTAL
            } 
            horizontalDictionary.set(wordPosition, word)
        }

        this.dictionaries.set(Orientation.VERTICAL, verticalDictionary)
        this.dictionaries.set(Orientation.HORIZONTAL, horizontalDictionary)
    }

    private isInBounds(x: number, y: number): boolean {
        return !(x < 0 || x >= this.width || y < 0 || y >= this.height)
    }

    getSquareAt(xOrSquarePosition: number | SquarePosition, y?: number): Square {
        if (typeof xOrSquarePosition === 'number') {
            const x: number = xOrSquarePosition as number
            if (y == null) {
                throw new TypeError('A y position must be given to retrieve the square')
            }

            if (!this.isInBounds(x, y)) {
                throw new RangeError('Index out of bounds')
            }

            return this.squareArray[y][x]
        }

        const position: SquarePosition = xOrSquarePosition as SquarePosition
        if (!this.isInBounds(position.x, position.y)) {
            throw new RangeError('Index out of bounds')
        }

        return this.squareArray[position.y][position.x]
    }

    getHorizontalWord(square: Square): null | {word: Word, index: number, position: WordPosition} {
        const horizontalDictionary = this.dictionaries.get(Orientation.HORIZONTAL)
        if (horizontalDictionary == null) {
            throw new Error('Horizontal dictionary is not initialized')
        }

        if (square.value === SquareValue.DARK_SQUARE) { return null }
        
        let currentSquare: Square = square
        let index: number = 0
        while (currentSquare.left != null) {
            currentSquare = currentSquare.left
            index++
        }
        const startPosition: SquarePosition = currentSquare.position

        currentSquare = square
        while (currentSquare.right != null) {
            currentSquare = currentSquare.right
        }
        const endPosition: SquarePosition = currentSquare.position

        const wordPosition: WordPosition = { start: startPosition, end: endPosition }
        const word = horizontalDictionary.get(wordPosition)
        if (word == null) {
            console.log(wordPosition)
            throw new Error('Cannot find horizontal word at this square')
        }

        return { word, index, position: wordPosition }
    }

    getVerticalWord(square: Square): null | {word: Word, index: number, position: WordPosition} {
        const verticalDictionary = this.dictionaries.get(Orientation.VERTICAL)
        if (verticalDictionary == null) {
            throw new Error('Vertical dictionary is not initialized')
        }

        if (square.value === SquareValue.DARK_SQUARE) { return null }
        
        let currentSquare: Square = square
        let index: number = 0
        while (currentSquare.up != null) {
            currentSquare = currentSquare.up
            index++
        }
        const startPosition: SquarePosition = currentSquare.position

        currentSquare = square
        while (currentSquare.down != null) {
            currentSquare = currentSquare.down
        }
        const endPosition: SquarePosition = currentSquare.position

        const wordPosition: WordPosition = { start: startPosition, end: endPosition }
        const word = verticalDictionary.get(wordPosition)
        if (word == null) {
            console.log(wordPosition)
            console.log(square)
            throw new Error('Cannot find vertical word at this square')
        }

        return { word, index, position: wordPosition }
    }

    private mutateSquareToDark(square: Square): void {
        if (square.value === SquareValue.DARK_SQUARE) {
            throw new Error('Square is already a dark square')
        }
        
        const horizontalWordData = this.getHorizontalWord(square)
        if (horizontalWordData != null) {
            this.dictionaries.get(Orientation.HORIZONTAL)?.delete(horizontalWordData.position)
            
            if (square.left != null) {
                square.left.right = null
                const newLeftWord: Word = {
                    squareValues: horizontalWordData.word.squareValues.slice(0, horizontalWordData.index),
                    orientation: Orientation.HORIZONTAL,
                    length: horizontalWordData.index,
                    clue: horizontalWordData.word.clue
                }
                if (newLeftWord.length > 0) {
                    const newLeftPosition: WordPosition = { start: horizontalWordData.position.start, end: square.left.position}
                    this.dictionaries.get(Orientation.HORIZONTAL)?.set(newLeftPosition, newLeftWord)
                }
            }

            if (square.right != null) {
                square.right.left = null
                const newRightWord: Word = {
                    squareValues: horizontalWordData.word.squareValues.slice(horizontalWordData.index + 1),
                    orientation: Orientation.HORIZONTAL,
                    length: horizontalWordData.word.length - horizontalWordData.index - 1,
                    clue: horizontalWordData.word.clue
                }
                if (newRightWord.length > 0) {
                    const newRightPosition: WordPosition = { start: square.right.position, end: horizontalWordData.position.end}
                    this.dictionaries.get(Orientation.HORIZONTAL)?.set(newRightPosition, newRightWord)
                }
            }
        }

        const verticalWordData = this.getVerticalWord(square)
        if (verticalWordData != null) {
            this.dictionaries.get(Orientation.VERTICAL)?.delete(verticalWordData.position)
            
            if (square.up != null) {
                square.up.down = null
                const newUpWord: Word = {
                    squareValues: verticalWordData.word.squareValues.slice(0, verticalWordData.index),
                    orientation: Orientation.VERTICAL,
                    length: verticalWordData.index,
                    clue: verticalWordData.word.clue
                }
                if (newUpWord.length > 0) {
                    const newUpPosition: WordPosition = { start: verticalWordData.position.start, end: square.up.position}
                    this.dictionaries.get(Orientation.VERTICAL)?.set(newUpPosition, newUpWord)
                }
            }

            if (square.down != null) {
                square.down.up = null
                const newDownWord: Word = {
                    squareValues: verticalWordData.word.squareValues.slice(verticalWordData.index + 1),
                    orientation: Orientation.VERTICAL,
                    length: verticalWordData.word.length - verticalWordData.index - 1,
                    clue: verticalWordData.word.clue
                }
                if (newDownWord.length > 0) {
                    const newDownPosition: WordPosition = { start: square.down.position, end: verticalWordData.position.end}
                    this.dictionaries.get(Orientation.VERTICAL)?.set(newDownPosition, newDownWord)
                }
            }
        }

        square.value = SquareValue.DARK_SQUARE
    }

    private mutateSquareFromDark(square: Square, newSquareValue: SquareValue): void {
        if (square.value !== SquareValue.DARK_SQUARE) {
            throw new Error('Square is not currently a dark square')
        }

        if (newSquareValue === SquareValue.DARK_SQUARE) {
            throw new Error('New square is not a dark square')
        }

        const newHorizontalWord: Word = {
            squareValues: [newSquareValue],
            length: 1,
            orientation: Orientation.HORIZONTAL,
            clue: ''
            // TODO: what to do with the two old clues. right now they're nixed
        }
        let newHorizontalStartPosition: SquarePosition = square.position
        let newHorizontalEndPosition: SquarePosition = square.position
        
        if (square.left != null) {
            const leftWordData = this.getHorizontalWord(square.left)
            if (leftWordData != null) {
                this.dictionaries.get(Orientation.HORIZONTAL)?.delete(leftWordData.position)
                newHorizontalStartPosition = leftWordData.position.start
                newHorizontalWord.squareValues.unshift(...leftWordData.word.squareValues)
                newHorizontalWord.length += leftWordData.word.length
            }
        }
        
        if (square.right != null) {
            const rightWordData = this.getHorizontalWord(square.right)
            if (rightWordData != null) {
                this.dictionaries.get(Orientation.HORIZONTAL)?.delete(rightWordData.position)
                newHorizontalEndPosition = rightWordData.position.end
                newHorizontalWord.squareValues.push(...rightWordData.word.squareValues)
                newHorizontalWord.length += rightWordData.word.length
            }
        }

        this.dictionaries.get(Orientation.HORIZONTAL)?.set(
            {start: newHorizontalStartPosition, end: newHorizontalEndPosition},
            newHorizontalWord
        )

        const newVerticalWord: Word = {
            squareValues: [newSquareValue],
            length: 1,
            orientation: Orientation.VERTICAL,
            clue: ''
        }
        let newVerticalStartPosition: SquarePosition = square.position
        let newVerticalEndPosition: SquarePosition = square.position
        
        if (square.up != null) {
            const upWordData = this.getVerticalWord(square.up)
            if (upWordData != null) {
                this.dictionaries.get(Orientation.VERTICAL)?.delete(upWordData.position)
                newVerticalStartPosition = upWordData.position.start
                newVerticalWord.squareValues.unshift(...upWordData.word.squareValues)
                newVerticalWord.length += upWordData.word.length
            }
        }
        
        if (square.down != null) {
            const downWordData = this.getVerticalWord(square.down)
            if (downWordData != null) {
                this.dictionaries.get(Orientation.VERTICAL)?.delete(downWordData.position)
                newVerticalEndPosition = downWordData.position.end
                newVerticalWord.squareValues.push(...downWordData.word.squareValues)
                newVerticalWord.length += downWordData.word.length
            }
        }

        this.dictionaries.get(Orientation.VERTICAL)?.set(
            {start: newVerticalStartPosition, end: newVerticalEndPosition},
            newVerticalWord
        )

        square.value = newSquareValue
    }

    private mutateSquareFromAlphabetToAlphabet(square: Square, newSquareValue: SquareValue): void {
        if (square.value === SquareValue.DARK_SQUARE) {
            throw new Error('Square is currently a dark square')
        }

        if (newSquareValue === SquareValue.DARK_SQUARE) {
            throw new Error('New square is a dark square')
        }

        const horizontalWord = this.getHorizontalWord(square)
        if (horizontalWord != null) {
            horizontalWord.word.squareValues[horizontalWord.index] = newSquareValue
        }

        const verticalWord = this.getVerticalWord(square)
        if (verticalWord != null) {
            verticalWord.word.squareValues[verticalWord.index] = newSquareValue
        }

        square.value = newSquareValue
    }

    mutateSquare(square: Square, newSquareValue: SquareValue): void {
        if (square.value !== SquareValue.DARK_SQUARE && newSquareValue === SquareValue.DARK_SQUARE) {
            this.mutateSquareToDark(square)
            return
        }

        if (square.value === SquareValue.DARK_SQUARE && newSquareValue !== SquareValue.DARK_SQUARE) {
            this.mutateSquareFromDark(square, newSquareValue)
            return
        }

        if (square.value !== SquareValue.DARK_SQUARE) {
            this.mutateSquareFromAlphabetToAlphabet(square, newSquareValue)
        }
    }

    mutateSquareAtPosition(squarePosition: SquarePosition, newSquareValue: SquareValue): void {
        this.mutateSquare(this.getSquareAt(squarePosition), newSquareValue)
    }

    displayBoard(): void {
        const line: string = '-'.repeat(2 * this.width + 1)
        console.log(line)
        for (let y = 0; y < this.height; y++) {
            console.log(this.squareArray[y].map((square: Square) => `|${squareValueToString(square.value)}`).join('') + '|')
            console.log(line)
        }
    }

    displayDictionaries(): void {
        this.dictionaries.forEach((dictionary: Dictionary, orientation: Orientation) => {
            if (orientation === Orientation.HORIZONTAL) { console.log('HORIZONTAL\n') }
            else { console.log('VERTICAL\n') }

            dictionary.forEach((word: Word, wordPosition: WordPosition) => {
                const wordText: string = word.squareValues.map((squareValue: SquareValue) => squareValueToString(squareValue)).join('')
                console.log(`\t(${wordPosition.start.x}, ${wordPosition.start.y}) to (${wordPosition.end.x}, ${wordPosition.end.y})`)
                console.log(`\t${wordText.trim() === '' ? '[No word]' : wordText}`)
                console.log(`\t${word.clue === '' ? '[No clue]' : word.clue}`)
                console.log()
            })
        })
    }
}