// TODO: this is a workaround because i forgor about SameValueZero oops
//       definitely not the right way to do it
import { Word, WordPosition } from "./types";

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