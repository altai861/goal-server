const mongoose = require("mongoose")

const GoalSchema = new mongoose.Schema(
    {
        goalTitle: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        completed: {
            type: Boolean,
            default: false
        }
    }
)

const Goal = mongoose.model("Goal", GoalSchema)

module.exports = Goal