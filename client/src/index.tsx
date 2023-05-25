import React from 'react'
import { createRoot } from 'react-dom/client'
import { SquarePosition, SquareValue } from '../types/types'
import Crossword from '../types/crossword'
import { CrosswordComponent } from '../components/crosswordComponent'

const App = () => {
    const crossword: Crossword = new Crossword(5, 5)

    // fill board with alphabet
    // for (let x = 0; x < 5; x++) {
    //     for (let y = 0; y < 5; y++) {
    //         const value: SquareValue = (5 * x + y) + 1
    //         const position: SquarePosition = {x, y}
    //         crossword.mutateSquareAtPosition(position, value)
    //     }
    // }

    return (
        <>
            <CrosswordComponent crossword={crossword} />
        </>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
