import React, { useState } from "react"
import Crossword from "../types/crossword"
import { Square } from "../types/types"
import { BoardComponent } from "./boardComponent"

interface CrosswordComponentProps {
    crossword: Crossword
}

export const CrosswordComponent = ({ crossword }: CrosswordComponentProps): JSX.Element => {
    const [selectedSquare, setSelectedSquare] = useState<null | Square>(null)

    const handleClickSquare = (square: Square): React.MouseEventHandler<HTMLDivElement> => {
        return (event) => {
            event.preventDefault()
            setSelectedSquare(square)
        }
    }

    return (
        <BoardComponent
            crossword={crossword}
            selectedSquare={selectedSquare}
            handleClickSquare={handleClickSquare}
        />
    )
}
