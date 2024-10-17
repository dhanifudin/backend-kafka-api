const mongoose = require('mongoose')

const { Schema } = mongoose

const TodoSchema = new Schema({
    name: String,
    done: Boolean
})

const Todo = mongoose.model('todo', TodoSchema)

module.exports = Todo