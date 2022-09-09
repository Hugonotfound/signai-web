const mongoose = require('mongoose')

const graphicTripSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    data: {type: Buffer, required: false},
    project_id: {type: String, required: true},
})

const graphicTrip = mongoose.model("graphicTrip", graphicTripSchema);

const graphicRoadSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    data: {type: Buffer, required: false},
    project_id: {type: String, required: true},
})

const graphicRoad = mongoose.model("graphicRoad", graphicRoadSchema);

module.exports = {GraphicRoad: graphicRoad, GraphicTrip: graphicTrip}


