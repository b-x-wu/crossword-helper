// TODO: this is a workaround because i forgor about SameValueZero oops
//       definitely not the right way to do it
import { Orientation, Word, WordPosition, type OrientedDictionaryKey, SquareValue, squareValueToString } from "./types";

export class OrientedDictionary {
    readonly orientation: Orientation
    readonly map: Map<OrientedDictionaryKey, Word>

    constructor(orientation: Orientation) {
        this.orientation = orientation
        this.map = new Map<OrientedDictionaryKey, Word>()
    }

    static wordPositionToOrientedDictionaryKey(wordPosition: WordPosition): OrientedDictionaryKey {
        // this implies that the max size of a board is
        // 2^13 by 2^13
        let key = wordPosition.start.x
        key = key << 13
        key = key + wordPosition.start.y
        key = key << 13
        key = key + wordPosition.end.x
        key = key << 13
        key = key + wordPosition.end.y
        return key
    }

    static orientedDictionaryKeyToWordPosition(key: OrientedDictionaryKey): WordPosition {
        const bitMask = 8191
        const endY = key & bitMask
        key = key >> 13
        const endX = key & bitMask
        key = key >> 13
        const startY = key & bitMask
        key = key >> 13
        return {
            start: {
                x: key,
                y: startY
            },
            end: {
                x: endX,
                y: endY
            }
        }
    }

    delete(wordPosition: WordPosition): boolean {
        const key = OrientedDictionary.wordPositionToOrientedDictionaryKey(wordPosition)
        return this.map.delete(key)
    }

    get(wordPosition: WordPosition): Word | undefined {
        const key = OrientedDictionary.wordPositionToOrientedDictionaryKey(wordPosition)
        return this.map.get(key)
    }

    set(wordPosition: WordPosition, word: Word): void {
        const key = OrientedDictionary.wordPositionToOrientedDictionaryKey(wordPosition)
        this.map.set(key, word)
    }

    forEach(callback: (word: Word, wordPosition: WordPosition) => void): void {
        this.map.forEach((word: Word, key: number) => {
            callback(word, OrientedDictionary.orientedDictionaryKeyToWordPosition(key))
        })
    }

    getSortedEntries(): Array<[OrientedDictionaryKey, Word]> {
        return [...this.map.entries()].sort(([key1], [key2]) => key1 - key2)
    }

    /**
     * Get the words in the dictionary in sorted order
     * @returns the words in the dictionary in order of starting positions
     */
    getWords(): Word[] {
        return this.getSortedEntries().map(([key, word]) => word)
    }

    print(): void {
        this.getSortedEntries().forEach(([key, word]) => {
            const wordPosition = OrientedDictionary.orientedDictionaryKeyToWordPosition(key)
            const wordText: string = word.squareValues.map((squareValue: SquareValue) => squareValueToString(squareValue)).join('')
            console.log(`\t(${wordPosition.start.x}, ${wordPosition.start.y}) to (${wordPosition.end.x}, ${wordPosition.end.y})`)
            console.log(`\t${wordText.trim() === '' ? '[No word]' : wordText}`)
            console.log(`\t${word.clue === '' ? '[No clue]' : word.clue}`)
            console.log()
        })
    }
}

export class CrosswordDictionary {
    readonly horizontalDictionary: OrientedDictionary
    readonly verticalDictionary: OrientedDictionary

    constructor() {
        this.horizontalDictionary = new OrientedDictionary(Orientation.HORIZONTAL)
        this.verticalDictionary = new OrientedDictionary(Orientation.VERTICAL)
    }
}

export default class Dictionary {
    readonly map: Map<string, Word>
    // TODO: there's a cannonical sort of the elements of the dictionary
    //       which depends on the location of the starting index of the word
    //       this is not currently reflected, though it does suggest
    //       that maybe a custom type might be good for either the dictionary
    //       or the combination horizontal and vertical dictionary

    constructor() {
        this.map = new Map<string, Word>()
    }

    delete(wordPosition: WordPosition): boolean {
        return this.map.delete(JSON.stringify(wordPosition))
    }

    get(wordPosition: WordPosition): Word | undefined {
        return this.map.get(JSON.stringify(wordPosition))
    }

    set(wordPosition: WordPosition, word: Word): void {
        this.map.set(JSON.stringify(wordPosition), word)
    }

    forEach(callback: (word: Word, wordPosition: WordPosition) => void): void {
        this.map.forEach((word: Word, wordPositionString: string) => {
            callback(word, JSON.parse(wordPositionString))
        })
    }
}