import React, { useEffect, useState } from 'react'

import { SquareComponent, SquareComponentProps } from './squareComponent'
import Crossword from '../types/crossword'
import { Orientation, Square, SquarePosition, WordPosition } from '../types/types'

interface CrosswordComponentProps {
    crossword: Crossword
}

export const CrosswordComponent = ({crossword}: CrosswordComponentProps): JSX.Element => {
    const [selectedSquarePosition, setSelectedSquarePosition] = useState<null | SquarePosition>(null) // this state might be passed up
    const [wordOrientation, setWordOrientation] = useState<Orientation>(Orientation.HORIZONTAL)
    const [squarePositionsInSelectedWord, setSquarePositionsInSelectedWord] = useState<SquarePosition[]>([])

    useEffect(() => {
        if (selectedSquarePosition != null) {
            const selectedSquare: Square = crossword.getSquareAt(selectedSquarePosition)
            let selectedWordPosition: WordPosition | undefined
            if (wordOrientation === Orientation.HORIZONTAL) {
                selectedWordPosition = crossword.getHorizontalWord(selectedSquare)?.position
            } else {
                selectedWordPosition = crossword.getVerticalWord(selectedSquare)?.position
            }

            if (selectedWordPosition == null) { return }
            setSquarePositionsInSelectedWord(Crossword.wordPositionToSquarePositions(selectedWordPosition))
        }
    }, [selectedSquarePosition, wordOrientation])

    const handleClickGenerator = (squarePosition: SquarePosition): React.MouseEventHandler<HTMLDivElement> => {
        return (event) => {
            event.preventDefault()
            if (squarePosition.x === selectedSquarePosition?.x && squarePosition.y === selectedSquarePosition.y) {
                setWordOrientation(wordOrientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL)
                return
            }
            setSelectedSquarePosition(squarePosition)
        }
    }

    const SQUARE_WIDTH = 75
    const SQUARE_HEIGHT = 75

    const squareComponents: Array<React.ReactElement<SquareComponentProps, any>> = crossword.squareArray.flat().map(
        (square) => {
            const isInSelectedWord: boolean = squarePositionsInSelectedWord == null ? false : squarePositionsInSelectedWord.reduce<boolean>((prev, cur) => {
                return prev || (cur.x === square.position.x && cur.y === square.position.y)
            }, false)
            return (
                <SquareComponent
                    key={(square.position.x << 13) + square.position.y}
                    square={square}
                    width={SQUARE_WIDTH}
                    height={SQUARE_HEIGHT}
                    handleClick={handleClickGenerator(square.position)}
                    isSelected={selectedSquarePosition != null && selectedSquarePosition.x === square.position.x && selectedSquarePosition.y === square.position.y}
                    isInSelectedWord={isInSelectedWord}
                />
            )
        }
    )

    return (
        <>
            <div className={`w-[${crossword.width * SQUARE_WIDTH}px] h-[${crossword.height * SQUARE_HEIGHT}px] grid grid-cols-${crossword.width} grid-rows-${crossword.height}`}>
                {squareComponents}
            </div>
        </>
    )
}
