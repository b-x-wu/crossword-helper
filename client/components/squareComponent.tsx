import React from "react"
import { Square, squareValueToString } from "../types/types"

interface SquareComponentProps {
    square: Square
    width?: string | number
    height?: string | number
    handleClick?: MouseEvent
}

export const SquareComponent = ({ square, width, height, handleClick }: SquareComponentProps): JSX.Element => {
    const componentWidth = width == null ? '5em' : (typeof width === 'string' ? width : `${width}px`)
    const componentHeight = height == null ? '5em' : (typeof height === 'string' ? height : `${height}px`)

    return (
        <div className={`flex items-center justify-center w-[${componentWidth}] h-[${componentHeight}] bg-gray-100 text-center border-2 border-black`}>
            <div>
                {squareValueToString(square.value)}
            </div>
        </div>
    )
}