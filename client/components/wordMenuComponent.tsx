import React, { useEffect, useState } from "react"
import { Orientation, SquarePosition, SquareValue, Word, squareValueToString, stringToSquareValue } from "../types/types"
import { HintComponent } from "./hintComponent"
interface WordMenuComponentProps {
    horizontalWord: Word | undefined
    verticalWord: Word | undefined
    squareValue: SquareValue
    handleChangeHorizontalClue: React.ChangeEventHandler<HTMLInputElement>
    handleChangeVerticalClue: React.ChangeEventHandler<HTMLInputElement>
    handleMutateSquare: (newSquareValue: SquareValue) => React.ChangeEventHandler<HTMLInputElement>
    squarePosition: SquarePosition
    handleWordHintSelect: (squarePosition: SquarePosition, orientation: Orientation, wordString: string) => React.MouseEventHandler<HTMLDivElement>
}
export const WordMenuComponent = ({ horizontalWord, verticalWord, squareValue, handleChangeHorizontalClue, handleChangeVerticalClue, handleMutateSquare, squarePosition, handleWordHintSelect }: WordMenuComponentProps): JSX.Element => {
    const [isDarkSquareInForm, setIsDarkSquareInForm] = useState<boolean>(squareValue === SquareValue.DARK_SQUARE)
    const [squareValueInForm, setSquareValueInForm] = useState<string>(squareValueToString(squareValue))
    const [horizontalClueInForm, setHorizontalClueInForm] = useState<string>('')
    const [verticalClueInForm, setVerticalClueInForm] = useState<string>('')

    useEffect(() => {
        setIsDarkSquareInForm(squareValue === SquareValue.DARK_SQUARE)
        if (squareValue === SquareValue.BLANK_SQUARE || squareValue === SquareValue.DARK_SQUARE) {
            setSquareValueInForm('')
        } else {
            setSquareValueInForm(squareValueToString(squareValue))
        }

        if (horizontalWord != null) {
            setHorizontalClueInForm(horizontalWord.clue)
        }
        if (verticalWord != null) {
            setVerticalClueInForm(verticalWord.clue)
        }
    }, [squareValue, horizontalWord, verticalWord])
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

    // TODO: this should be moved to a component
    const createWordInformationForm = (orientation: Orientation): JSX.Element => {
        const word = orientation === Orientation.HORIZONTAL ? horizontalWord : verticalWord
        if (word == null) { return <></> }
        const orientationString = orientation === Orientation.HORIZONTAL ? "Horizontal" : "Vertical"
        const clueInForm = orientation === Orientation.HORIZONTAL ? horizontalClueInForm : verticalClueInForm
        const changeClueHandler = orientation === Orientation.HORIZONTAL ? handleChangeHorizontalClue : handleChangeVerticalClue
        const wordString = word.squareValues.map((squareValue) => squareValueToString(squareValue)).join('')
        return (
            <div className="flex flex-col gap-y-2 bg-gray-100 p-4">
                <h2 className="text-lg">{orientationString} Word: {wordString}</h2>
                <form className="flex flex-col gap-y-2">
                    <label
                        htmlFor={`${orientationString}-clue-input`}
                    >{orientationString} Clue:</label>
                    <input
                        className="h-8 w-full bg-white border border-gray-500 p-2 rounded-md"
                        value={clueInForm}
                        onChange={changeClueHandler}
                    ></input>
                    <HintComponent
                        word={wordString}
                        clue={clueInForm}
                        squarePosition={squarePosition}
                        orientation={orientation}
                        handleWordHintSelect={handleWordHintSelect}
                    />
                </form>
            </div>
        ) 
    }

    return (
        <div className="flex flex-col m-6 gap-y-6">
            <form className="flex flex-col gap-y-6 bg-gray-100 p-4">
                <div className="flex flex-col gap-y-1">
                    <label
                        htmlFor="square-value-input"
                    >Square Value</label>
                    <input
                        id="square-value-input"
                        className="h-10 w-10 bg-white border border-gray-500 p-2 text-lg text-center rounded-md"
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
            {createWordInformationForm(Orientation.HORIZONTAL)}
            {createWordInformationForm(Orientation.VERTICAL)}
        </div>
    )
}