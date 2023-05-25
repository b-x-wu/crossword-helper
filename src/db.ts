import mongoose from 'mongoose'

export interface WordHint {
    word: string,
    clues: string[]
} // TODO: add sources to clues

export const MongooseConnection = mongoose.connect('mongodb://127.0.0.1:27017/crosswordhelper')

const wordHintSchema = new mongoose.Schema<WordHint>({
    word: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => {
                return /^[A-Z]+$/.test(v)
            },
            message: (props) => `Word must be all capital letters (${props.value})`
        }
    },
    clues: {
        type: [String],
        required: true
    }
})

export const WordHintModel = mongoose.model<WordHint>('WordHint', wordHintSchema)
