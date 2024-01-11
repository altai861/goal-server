const mongoose = require("mongoose")

const ListSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    }
)

const List = mongoose.model("List", ListSchema)

module.exports = List