import React, { useEffect, useState } from 'react'
import { Orientation, SquarePosition } from '../types/types'

interface WordHint {
    word: string,
    clues: string[],
}

interface HintComponentProps {
    word: string,
    clue: string,
    squarePosition: SquarePosition,
    orientation: Orientation,
    handleWordHintSelect: (squarePosition: SquarePosition, orientation: Orientation, wordString: string) => React.MouseEventHandler<HTMLDivElement>
    handleClueHintSelect: (squarePosition: SquarePosition, orientation: Orientation, wordString: string) => React.MouseEventHandler<HTMLDivElement>
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = <T,>(array: Array<T>): Array<T> => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const HintComponent = (props: HintComponentProps) => {
    const [wordHints, setWordHints] = useState<WordHint[]>([])
    const [clueHints, setClueHints] = useState<string[]>([])

    useEffect(() => {
        if (props.word.includes('_')) {
            // still need to finish the word. look for word hints
            fetch(`http://localhost:3000/word_hint?word=${props.word}`).then((res) => {
                return res.json()
            }).then((data: WordHint[]) => {
                setClueHints([])
                setWordHints(shuffle(data).slice(0, 10).map((wordHint) => {
                    return {
                        word: wordHint.word,
                        clues: shuffle(wordHint.clues).slice(0, 10)
                    }
                }))
            }).catch(console.log)
            return
        }

        // word is complete. look only for clues
        if (props.clue === '') {
            fetch(`http://localhost:3000/clue_hint?word=${props.word}`).then((res) => {
                return res.json()
            }).then((data: string[]) => {
                setWordHints([])
                setClueHints(shuffle(data).slice(0, 10))
            }).catch(console.log)
            return
        }

        // word is complete and clue is present. do nothing
        setWordHints([])
        setClueHints([])
    }, [props.word, props.clue])

    const wordHintElements = wordHints.map((wordHint, wordHintIdx) => {
        const clueElements = wordHint.clues.map((clue, clueIdx) => {
            return (
                <div
                    key={clueIdx}
                    className='border-2 border-gray-300 p-1 cursor-pointer'
                    onClick={(event) => {
                        props.handleWordHintSelect(props.squarePosition, props.orientation, wordHint.word)(event)
                        props.handleClueHintSelect(props.squarePosition, props.orientation, clue)(event)
                    }}
                >
                    {clue}
                </div>
            )
        })
        return (
            <div className='flex flex-row gap-x-8' key={wordHintIdx}>
                <div className='h-full w-1/6 cursor-pointer' onClick={props.handleWordHintSelect(props.squarePosition, props.orientation, wordHint.word)}>{wordHint.word}</div>
                <div className='h-fit max-h-24 w-full overflow-auto bg-gray-200'>
                    {clueElements}
                </div>
            </div>
        )
    })

    const clueHintElements = clueHints.map((clue, clueIdx) => {
        return (
            <div className='border-2 border-gray-300 p-1 cursor-pointer' onClick={props.handleClueHintSelect(props.squarePosition, props.orientation, clue )} key={clueIdx}>{clue}</div>
        )
    })

    return (
        <div className='w-full h-fit'>
            {wordHintElements.length === 0 ? <></> : 
                <div className='flex flex-col gap-y-4'>
                    <div className='flex flex-row'>
                        <div className='h-full w-1/6'>Word Hints</div>
                        <div className='h-full'>Clue Hints</div>
                    </div>
                    {wordHintElements}
                </div>
            }
            {clueHintElements.length === 0 ? <></> :
                <div className='flex flex-col gap-y-4'>
                    <div>Clue Hints</div>
                    <div className='h-fit w-full bg-gray-200'>
                        {clueHintElements}
                    </div>
                </div>
            }
        </div>
    )
}
