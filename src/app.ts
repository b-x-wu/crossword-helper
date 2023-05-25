import express, { Request } from 'express'
import { MongooseConnection, WordHintModel } from './db'

const app = express()

app.get('/word_hint', (req: Request<{}, any, any, { word: string }>, res) => {
    const wordMatch: RegExp = RegExp(`^${req.query['word'].replace('_', '\\w')}$`)
    WordHintModel.find({ word: { $regex: wordMatch } }).then((val) => {
        res.json(val)
    })
})

app.listen('3000', async () => {
    console.log('Listening on port 3000')
    await MongooseConnection
    console.log('Connected to db')
})
