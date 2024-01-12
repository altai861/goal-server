const mongoose = require("mongoose")

const TodoSchema = new mongoose.Schema(
    {
        todoTitle: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            required: false
        },
        listId: {
            type: String,
            required: false
        },
        userId: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        }
    }
)

const Todo = mongoose.model("Todo", TodoSchema)

module.exports = Todo