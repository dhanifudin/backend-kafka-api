const mongoose = require('mongoose')
const axios = require('axios')
const kafka = require('./lib/kafka')('consumer')
const Todo = require('./models/todo')
const serverUrl = 'http://localhost:3000'

const mongoDatabase = "mongodb://localhost/todos"

const connectMongo = async () => {
    await mongoose.connect(mongoDatabase)
}

const consumer = kafka.consumer({ groupId: 'test-group' })
const runConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log('insert data')
        const data = JSON.parse(message.value.toString())
        const todo = new Todo(data)
        await todo.save()
        await axios.post(`${serverUrl}/v1/todos/callback`, todo.toObject({getters: true}))
    },
  })
}

connectMongo()
runConsumer()