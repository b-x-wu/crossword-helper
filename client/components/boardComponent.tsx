import React, { useEffect, useState } from 'react'

import { SquareComponent, SquareComponentProps } from './squareComponent'
import Crossword from '../types/crossword'
import { Orientation, Square, SquarePosition, Word, WordPosition } from '../types/types'

interface BoardComponentProps {
    width: number
    height: number
    squares: Square[]
    selectedHorizontalWordPosition: null | WordPosition
    selectedVerticalWordPosition: null | WordPosition
    selectedSquare: null | Square
    handleClickSquare: (square: Square) => React.MouseEventHandler<HTMLDivElement>
}

export const BoardComponent = ({width, height, squares, selectedHorizontalWordPosition, selectedVerticalWordPosition, selectedSquare, handleClickSquare}: BoardComponentProps): JSX.Element => {
    const SQUARE_WIDTH = 75
    const SQUARE_HEIGHT = 75

    const squarePositionsInSelectedHorizontalWord = selectedHorizontalWordPosition == null ? [] : Crossword.wordPositionToSquarePositions(selectedHorizontalWordPosition)
    const squarePositionsInSelectedVerticalWord = selectedVerticalWordPosition == null ? [] : Crossword.wordPositionToSquarePositions(selectedVerticalWordPosition)
    const squarePositionsInSelectedWords = [...squarePositionsInSelectedHorizontalWord, ...squarePositionsInSelectedVerticalWord]

    const squareComponents: Array<React.ReactElement<SquareComponentProps, any>> = squares.map(
        (square) => {
            const isInSelectedWord: boolean = squarePositionsInSelectedWords.reduce<boolean>((prev, cur) => {
                return prev || (cur.x === square.position.x && cur.y === square.position.y)
            }, false)
            return (
                <SquareComponent
                    key={(square.position.x << 13) + square.position.y}
                    squareValue={square.value}
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
            <div className={`w-[${width * SQUARE_WIDTH}px] h-[${height * SQUARE_HEIGHT}px] grid grid-cols-${width} grid-rows-${height}`}>
                {squareComponents}
            </div>
        </>
    )
}
