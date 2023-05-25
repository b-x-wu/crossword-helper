import React, { useEffect } from 'react'

interface WordHint {
    word: string,
    clues: string[],
}

interface HintComponentProps {
    word: string
}

export const HintComponent = (props: HintComponentProps) => {
    useEffect(() => {
        fetch(`http://localhost:3000/word_hint?word=${props.word}`).then((res) => {
            console.log('got the fetch')
            return res.json()
        }).then((data: WordHint[]) => {
            console.log(JSON.stringify(data, null, 2))
        }).catch(console.log)
    }, [props.word])

    return (
        <div className='w-full h-fit p-2'>
            {props.word}
        </div>
    )
}