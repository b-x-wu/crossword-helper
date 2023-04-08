import React, { useEffect, useState } from 'react'

import { SquareComponent, SquareComponentProps } from './squareComponent'
import Crossword from '../types/crossword'
import { Orientation, Square, SquarePosition, WordPosition } from '../types/types'

interface BoardComponentProps {
    crossword: Crossword
    selectedSquare: null | Square
    handleClickSquare: (square: Square) => React.MouseEventHandler<HTMLDivElement>
}

export const BoardComponent = ({crossword, selectedSquare, handleClickSquare}: BoardComponentProps): JSX.Element => {
    const [squaresInSelectedWord, setSquaresInSelectedWord] = useState<Square[]>([])

    useEffect(() => {
        if (selectedSquare != null) {
            const selectedHorizontalWordPosition: WordPosition | undefined = crossword.getHorizontalWord(selectedSquare)?.position
            const selectedVerticalWordPosition: WordPosition | undefined = crossword.getVerticalWord(selectedSquare)?.position
            
            let newSquaresInSelectedWord: Square[] = []
            if (selectedHorizontalWordPosition != null) {
                newSquaresInSelectedWord = [...newSquaresInSelectedWord, ...newSquaresInSelectedWord.concat(crossword.wordPositionToSquares(selectedHorizontalWordPosition))]
            }
            if (selectedVerticalWordPosition != null) {
                newSquaresInSelectedWord = [...newSquaresInSelectedWord, ...newSquaresInSelectedWord.concat(crossword.wordPositionToSquares(selectedVerticalWordPosition))]
            }
            setSquaresInSelectedWord(newSquaresInSelectedWord)
        }
    }, [selectedSquare])

    const SQUARE_WIDTH = 75
    const SQUARE_HEIGHT = 75

    const squareComponents: Array<React.ReactElement<SquareComponentProps, any>> = crossword.squareArray.flat().map(
        (square) => {
            const isInSelectedWord: boolean = squaresInSelectedWord == null ? false : squaresInSelectedWord.reduce<boolean>((prev, cur) => {
                return prev || (cur.position.x === square.position.x && cur.position.y === square.position.y)
            }, false)
            return (
                <SquareComponent
                    key={(square.position.x << 13) + square.position.y}
                    square={square}
                    width={SQUARE_WIDTH}
                    height={SQUARE_HEIGHT}
                    handleClick={handleClickSquare(square)}
                    isSelected={selectedSquare != null && selectedSquare.position.x === square.position.x && selectedSquare.position.y === square.position.y}
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
