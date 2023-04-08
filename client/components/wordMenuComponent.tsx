import React, { useEffect, useState } from "react"
import { Square, SquareValue, Word, squareValueToString, stringToSquareValue } from "../types/types"

interface WordMenuComponentProps {
    horizontalWord: Word | undefined
    verticalWord: Word | undefined
    squareValue: SquareValue
    handleMutateSquare: (newSquareValue: SquareValue) => React.ChangeEventHandler<HTMLInputElement>
}

export const WordMenuComponent = ({ horizontalWord, verticalWord, squareValue, handleMutateSquare }: WordMenuComponentProps): JSX.Element => {
    const [isDarkSquareInForm, setIsDarkSquareInForm] = useState<boolean>(squareValue === SquareValue.DARK_SQUARE)
    const [squareValueInForm, setSquareValueInForm] = useState<string>(squareValueToString(squareValue))

    useEffect(() => {
        setSquareValueInForm(squareValueToString(squareValue))
        setIsDarkSquareInForm(squareValue === SquareValue.DARK_SQUARE)
    }, [squareValue])

    const handleSquareValueInFormChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault()
        const formValue = event.target.value
        if (formValue.length > 1) { return }
        if (formValue.length < 1) {
            setSquareValueInForm('')
            return
        }
        if (formValue.charCodeAt(0) >= 65 && formValue.charCodeAt(0) < 91) {
            handleMutateSquare(stringToSquareValue(formValue))(event)
        }
    }

    const handleIsDarkSquareInFormChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault()
        handleMutateSquare(isDarkSquareInForm ? SquareValue.BLANK_SQUARE : SquareValue.DARK_SQUARE)(event)
    }

    const horizontalWordInformation = horizontalWord == null ? <></> : (
        <div>
            <div>Horizontal Word</div>
            <div>{horizontalWord.squareValues.map((squareValue) => squareValueToString(squareValue)).join('')}</div>
            <div>{horizontalWord.clue === '' ? '[no clue]' : horizontalWord.clue}</div>
        </div>
    )

    const verticalWordInformation = verticalWord == null ? <></> : (
        <div>
            <div>Vertical Word</div>
            <div>{verticalWord.squareValues.map((squareValue) => squareValueToString(squareValue)).join('')}</div>
            <div>{verticalWord.clue === '' ? '[no clue]' : verticalWord.clue}</div>
        </div>
    )

    return (
        <>
            <form>
                <input value={squareValueInForm} disabled={isDarkSquareInForm} type={'text'} onChange={handleSquareValueInFormChange}></input>
                <input type={'checkbox'} checked={isDarkSquareInForm} onChange={handleIsDarkSquareInFormChange}></input>
            </form>
            {horizontalWordInformation}
            {verticalWordInformation}
        </>
    )
}
