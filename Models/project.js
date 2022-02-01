const mongoose = require('mongoose');
const comment = require('./comments').model('comment').schema;

const positionSchema = mongoose.Schema({
    lat: {type: Number, required: true},
    long: {type: Number, required: true},
})

const contraintSchema = mongoose.Schema({
    type: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
})
const projectSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    departAddress: {type: String, required: true},
    radius: {type: Number, required: true},
    contraints: [contraintSchema],
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
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    comments: [{comment}],
})

module.exports = mongoose.model('project', projectSchema)

