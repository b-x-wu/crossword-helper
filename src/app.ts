import express, { Request } from 'express'
import cors from 'cors'
import { MongooseConnection, WordHintModel } from './db'

const app = express()
app.use(cors())

app.get('/word_hint', (req: Request<{}, any, any, { word: string }>, res) => {
    const wordMatch: RegExp = RegExp(`^${req.query.word.replaceAll('_', '\\w')}$`)
    WordHintModel.find({ word: { $regex: wordMatch } }).then((val) => {
        res.json(val)
    })
})

app.get('/clue_hint', (req: Request<{}, any, any, { word: string }>, res) => {
    WordHintModel.find({ word: req.query.word }).then((val) => {
        if (val.length == 0) {
            res.status(404).json({ message: `No clues associated with word. (${req.query.word})` })
            return
        }
        res.json(val[0].clues)
    })
})

app.listen('3000', async () => {
    console.log('Listening on port 3000')
    await MongooseConnection
    console.log('Connected to db')
})
