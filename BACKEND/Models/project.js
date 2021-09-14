const mongoose = require('mongoose')

const positionSchema = mongoose.Schema({
    lat: {type: float, required: true},
    long: {type: float, required: true},
})

const contraintsSchema = mongoose.Schema({
    contraint: {type: string, required: true},
    position: positionSchema,

})

const projectSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    departCoordinates: positionSchema,
    departAddress: {type: String, required: true},
    radius: {type: float, required: true},
    contraints: [{contraintsSchema}],
    company: {type: String, required: true},
    managers: [{accoundID: String}],
    observators: [{accoundID: String}],
    creationDate: {type: Date.now},
    lastEdit: {type: Date, required: true},
})

module.exports = mongoose.model('project', projectSchema)

