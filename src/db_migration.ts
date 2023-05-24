import { connect } from 'mongoose'

main().then(() => console.log('connected')).catch(console.log)

async function main() {
    await connect('mongodb://127.0.0.1:27017/test')
}
