const kafka = require('./kafka')('consumer')

const consumer = kafka.consumer({ groupId: 'test-group' })

const runConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })
}

runConsumer()