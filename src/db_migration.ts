import mongoose from 'mongoose'
import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import { MongooseConnection, WordHintModel } from './db'

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
    await MongooseConnection
    migrateToDb()
}
