import React from 'react'

import { SquareComponent } from './squareComponent'
import Crossword from '../types/crossword'

interface CrosswordComponentProps {
    crossword: Crossword
}

export const CrosswordComponent = ({crossword}: CrosswordComponentProps): JSX.Element => {
    const SQUARE_WIDTH = 75
    const SQUARE_HEIGHT = 75

    const squares = crossword.squareArray.flat().map(
        (square) => <SquareComponent square={square} width={SQUARE_WIDTH} height={SQUARE_HEIGHT} />
    )
    return (
        <>
            <div className={`w-[${crossword.width * SQUARE_WIDTH}px] h-[${crossword.height * SQUARE_HEIGHT}px] grid grid-cols-${crossword.width} grid-rows-${crossword.height}`}>
                {squares}
            </div>
        </>
    )
}
