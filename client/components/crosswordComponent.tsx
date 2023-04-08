import React, { useEffect, useState } from "react"
import Crossword from "../types/crossword"
import { Square, SquareValue, Word, WordPosition } from "../types/types"
import { BoardComponent } from "./boardComponent"
import { WordMenuComponent } from "./wordMenuComponent"

interface CrosswordComponentProps {
    crossword: Crossword
}

export const CrosswordComponent = ({ crossword }: CrosswordComponentProps): JSX.Element => {
    const [selectedSquare, setSelectedSquare] = useState<null | Square>(null)
    const [selectedHorizontalWordPosition, setSelectedHorizontalWordPosition] = useState<null | WordPosition>(null)
    const [selectedVerticalWordPosition, setSelectedVerticalWordPosition] = useState<null | WordPosition>(null)
    const [squareArray, setSquareArray] = useState<Square[]>(crossword.squareArray.flat())

    useEffect(() => {
        if (selectedSquare == null) {
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
                crossword.printBoard()
                setSelectedSquare({...crossword.getSquareAt(selectedSquare.position)})
                setSquareArray(crossword.squareArray.flat().map((square) => ({...square})))
            }
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
                    horizontalWord={selectedSquare == null ? undefined : crossword.getHorizontalWord(selectedSquare)?.word}
                    verticalWord={selectedSquare == null ? undefined : crossword.getVerticalWord(selectedSquare)?.word}
                    handleMutateSquare={handleMutateSquare}
                    squareValue={selectedSquare.value}
                />
            }
        </>
    )
}
