const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const kafka = require('./lib/kafka')('publisher')
const producer = kafka.producer()

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/v1/todos', async (req, res) => {
    const { Todo } = require('./models')
    const data = req.body
    console.log(data)
    const { name, done } = req.body
    try {
        const newTodo = await Todo.create({
            name, done
        })
        await producer.send({
            topic: 'test-topic',
            messages: [
                { value: JSON.stringify(newTodo) },
            ],
        })
        res.status(201).json(newTodo)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal error' })
    }
})

app.listen(3000, async () => {
    await producer.connect()
    console.log('Server listening on 3000')
})