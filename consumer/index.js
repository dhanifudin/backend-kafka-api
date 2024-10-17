const mongoose = require('mongoose')
const kafka = require('./lib/kafka')('consumer')
const Todo = require('./models/todo')

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
      // console.table({
        // value: JSON.parse(message.value.toString()),
        //value: message.value.toString(),
      // })
    },
  })
}

connectMongo()
runConsumer()