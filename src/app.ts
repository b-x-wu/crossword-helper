import express from 'express'
import { MongooseConnection, WordHintModel } from './db'

const app = express()

app.get('/word_hint', (req, res) => {
    WordHintModel.find({ word: 'ADA' }, {}).then((val) => {
        res.json(val)
    })
})

app.listen('3000', async () => {
    console.log('Listening on port 3000')
    await MongooseConnection
})
