const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: {type: String, required: true},
    address: {type: String, required: true},
    postalcode: {type: Integer, required: true},
    city: {type: String, required: true},
    managers: [{accoutID: String}],
})

module.exports = mongoose.model('client', clientSchema)

