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
        setIsDarkSquareInForm(squareValue === SquareValue.DARK_SQUARE)
        if (squareValue === SquareValue.BLANK_SQUARE || squareValue === SquareValue.DARK_SQUARE) {
            setSquareValueInForm('')
            return
        }
        setSquareValueInForm(squareValueToString(squareValue))
    }, [squareValue])
    const handleSquareValueInFormChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault()
        const formValue = event.target.value
        if (formValue.length > 1) { return }
        if (formValue.length < 1) {
            handleMutateSquare(SquareValue.BLANK_SQUARE)(event)
            return
        }
        const charCode = formValue.charCodeAt(0)
        if (charCode >= 97 && charCode < 123) { // check if lowercase
            handleMutateSquare(stringToSquareValue(formValue.toUpperCase()))(event)
            return
        }
        if (charCode >= 65 && charCode < 91) {
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
            <form className="m-6">
                <div className="flex flex-col gap-y-1">
                    <label
                        htmlFor="square-value-input"
                    >Square Value</label>
                    <input
                        id="square-value-input"
                        className="h-8 w-8 bg-gray-100 border border-gray-300 p-2"
                        value={squareValueInForm}
                        disabled={isDarkSquareInForm}
                        type={'text'}
                        onChange={handleSquareValueInFormChange}
                    ></input>
                </div>
                <div className="flex flex-col gap-y-1">
                    <label
                        htmlFor="is-dark-square-checkbox"
                    >Toggle Dark Square</label>
                    <input
                        className="h-6 w-6 bg-gray-100 border border-gray-300"
                        id="is-dark-square-checkbox"
                        type={'checkbox'}
                        checked={isDarkSquareInForm}
                        onChange={handleIsDarkSquareInFormChange}
                    ></input>
                </div>
            </form>
            {horizontalWordInformation}
            {verticalWordInformation}
        </>
    )
}