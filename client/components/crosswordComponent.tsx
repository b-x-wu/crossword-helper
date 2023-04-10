import React, { useEffect, useState } from "react"
import Crossword from "../types/crossword"
import { Orientation, Square, SquareValue, Word, WordPosition } from "../types/types"
import { BoardComponent } from "./boardComponent"
import { WordMenuComponent } from "./wordMenuComponent"
import { OrientedDictionary } from "../types/dictionary"

interface CrosswordComponentProps {
    crossword: Crossword
}

export const CrosswordComponent = ({ crossword }: CrosswordComponentProps): JSX.Element => {
    const [selectedSquare, setSelectedSquare] = useState<null | Square>(null)
    const [selectedHorizontalWordPosition, setSelectedHorizontalWordPosition] = useState<null | WordPosition>(null)
    const [selectedVerticalWordPosition, setSelectedVerticalWordPosition] = useState<null | WordPosition>(null)
    const [squareArray, setSquareArray] = useState<Square[]>(crossword.squareArray.flat())

    useEffect(() => {
        if (selectedSquare == null || selectedSquare.value === SquareValue.DARK_SQUARE) {
            setSelectedHorizontalWordPosition(null)
            setSelectedVerticalWordPosition(null)
            return
        }

        const selectedHorizontalWordPosition = crossword.getHorizontalWord(selectedSquare)?.position
        const selectedVerticalWordPosition = crossword.getVerticalWord(selectedSquare)?.position

        if (selectedHorizontalWordPosition != null) {
            setSelectedHorizontalWordPosition({...selectedHorizontalWordPosition})
        }
        if (selectedVerticalWordPosition != null) {
            setSelectedVerticalWordPosition({...selectedVerticalWordPosition})
        }
    }, [selectedSquare])

    const handleClickSquare = (square: Square): React.MouseEventHandler<HTMLDivElement> => {
        return (event) => {
            event.preventDefault()
            setSelectedSquare({...square})
        }
    }

    const handleMutateSquare = (newSquareValue: SquareValue): React.ChangeEventHandler<HTMLInputElement> => {
        return (event) => {
            event.preventDefault()
            if (selectedSquare != null) {
                crossword.mutateSquareAtPosition(selectedSquare.position, newSquareValue)
                setSelectedSquare({...crossword.getSquareAt(selectedSquare.position)})
                setSquareArray(crossword.squareArray.flat().map((square) => ({...square})))
            }
        }
    }

    const handleChangeVerticalClue: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault()
        if (selectedVerticalWordPosition == null) { return } 
        crossword.dictionary.verticalDictionary.setClue(selectedVerticalWordPosition, event.target.value)
        // TODO: this is used to force a dom reload which is not particularly performant
        setSelectedVerticalWordPosition({
            start: {...selectedVerticalWordPosition.start},
            end: {...selectedVerticalWordPosition.end}
        })
    }
    
    const handleChangeHorizontalClue: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault()
        if (selectedHorizontalWordPosition == null) { return }
        crossword.dictionary.horizontalDictionary.setClue(selectedHorizontalWordPosition, event.target.value)
        if (selectedHorizontalWordPosition != null) {
            // TODO: this is used to force a dom reload which is not particularly performant
            setSelectedHorizontalWordPosition({
                start: {...selectedHorizontalWordPosition.start},
                end: {...selectedHorizontalWordPosition.end}
            })
        }
    }

    const computeSelectedWord = (selectedWordPosition: WordPosition | null, orientation: Orientation): Word | undefined => {
        if (selectedWordPosition == null) { return undefined }

        const orientedDictionary: OrientedDictionary = orientation === Orientation.HORIZONTAL
            ? crossword.dictionary.horizontalDictionary 
            : crossword.dictionary.verticalDictionary
        const word = orientedDictionary.get(selectedWordPosition)
        if (word == null) { return undefined }
        return { // return copy for rerendering
            squareValues: [...word.squareValues],
            orientation: word.orientation,
            length: word.length,
            clue: word.clue
        }
    }

    return (
        <>
            <BoardComponent
                width={crossword.width}
                height={crossword.height}
                squares={squareArray}
                selectedHorizontalWordPosition={selectedHorizontalWordPosition}
                selectedVerticalWordPosition={selectedVerticalWordPosition}
                selectedSquare={selectedSquare}
                handleClickSquare={handleClickSquare}
            />
            {
                selectedSquare == null 
                ? <></> 
                :<WordMenuComponent
                    horizontalWord={computeSelectedWord(selectedHorizontalWordPosition, Orientation.HORIZONTAL)}
                    verticalWord={computeSelectedWord(selectedVerticalWordPosition, Orientation.VERTICAL)}
                    handleChangeHorizontalClue={handleChangeHorizontalClue}
                    handleChangeVerticalClue={handleChangeVerticalClue}
                    handleMutateSquare={handleMutateSquare}
                    squareValue={selectedSquare.value}
                />
            }
        </>
    )
}
