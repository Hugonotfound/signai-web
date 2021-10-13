const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true},
    phone: {type: String, required: true},
    company: {type: String, required: true},
})

module.exports = mongoose.model('user', userSchema)