import mongoose from 'mongoose'
import { type UpdateOneModel } from 'mongodb'
import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'

interface WordHint {
    word: string,
    clues: string[]
} // TODO: add sources to clues

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

const WordHintModel = mongoose.model<WordHint>('WordHint', wordHintSchema)

main().then(() => console.log('connected')).catch(console.log)

function migrateToDb() {
    const operations: mongoose.mongo.AnyBulkWriteOperation[] = []
    fs.createReadStream(path.join(__dirname, '../clues.tsv'))
        .pipe(csv({ separator: '\t' }))
        .on('data', (data: any) => {
            operations.push({
                updateOne: {
                    filter: { word: data.answer },
                    update: { $addToSet: { clues: data.clue } },
                    upsert: true
                }
            })
            
            if (operations.length % 1000 === 0) {
                WordHintModel.collection.bulkWrite(operations, { ordered: true }).catch(() => {})
                operations.splice(0, operations.length)
            }
        })
        .on('close', () => {
            console.log('closed stream')
        })
}

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/crosswordhelper')
    migrateToDb()
}
