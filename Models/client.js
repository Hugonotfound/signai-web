const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: {type: String, required: true},
    address: {type: String, required: true},
    postalcode: {type: Number, required: true},
    city: {type: String, required: true},
    managers: [{accountID: String}],
})

module.exports = mongoose.model('client', clientSchema)