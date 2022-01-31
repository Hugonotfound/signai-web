const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    author: {type: String, required: true},
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    message: {type: String, required: true},
})

module.exports = mongoose.model('comment', commentSchema)

