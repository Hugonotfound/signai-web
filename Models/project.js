const mongoose = require('mongoose')



const positionSchema = mongoose.Schema({
    lat: {type: Number, required: true},
    long: {type: Number, required: true},
})

const contraintSchema = mongoose.Schema({
    contraint: {type: String, required: true},
    position: positionSchema,

})

const projectSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    departCoordinates: positionSchema,
    departAddress: {type: String, required: true},
    radius: {type: Number, required: true},
    contraints: [{contraintSchema}],
    company: {type: String, required: true},
    managers: [{type: String}],
    observators: [{type: String}],
    status: {type: String, required: true},
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: String,
        immutable: true,
        default: () => Date.now(),
    },
    lastEdit: {type: Date, required: true},
})

module.exports = mongoose.model('project', projectSchema)

