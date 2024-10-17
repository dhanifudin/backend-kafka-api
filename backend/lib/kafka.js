const { Kafka } = require('kafkajs')

module.exports = (clientId) => {
    const kafka = new Kafka({
        clientId, brokers: ['localhost:9092']
    })
    return kafka
}