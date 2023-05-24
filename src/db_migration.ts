import mongoose from 'mongoose'

interface ClueHint {
    clue: string,
    source: string,
    year?: string
}

interface WordHint {
    word: string,
    clues: Array<ClueHint>
}

const clueHintSchema = new mongoose.Schema<ClueHint>({
    clue: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    year: {
        type: String,
        validate: {
            validator: (v: string) => {
                return /\d{4}/.test(v)
            },
            message: (props) => `${props.value} is not a valid year`
        },
        required: false
    }
})

const wordHintSchema = new mongoose.Schema<WordHint>({
    word: {
        type: String,
        required: true
    },
    clues: {
        type: [clueHintSchema],
        required: true
    }
})

const WordHintModel = mongoose.model<WordHint>('WordHint', wordHintSchema)

main().then(() => console.log('connected')).catch(console.log)

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test')

    const newWordHint = new WordHintModel({
        word: 'ABA',
        clues: [
            {
                clue: 'Litigator\'s group',
                source: 'atc',
                year: '1997'
            }
        ]
    })
    await newWordHint.save()
}
