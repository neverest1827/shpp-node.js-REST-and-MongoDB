import express, {Express} from 'express';

type TypePort = 3000

const app: Express = express()
const port: TypePort = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})