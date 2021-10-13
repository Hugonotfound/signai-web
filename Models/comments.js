const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    author: {type: String, required: true},
    date: {type: Date.now, required: true},
    message: {type: String, required: true},
})

module.exports = mongoose.model('comment', commentSchema)

