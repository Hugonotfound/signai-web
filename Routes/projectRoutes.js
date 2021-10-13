const express = require('express');
const router = express.Router();
const {ProjectModel, ContraintSchema, positionSchema} = require('../models/project.js');
const {authenticateToken, authenticateManager} = require('../Configs/auth.js');


router.post('', authenticateToken, authenticateManager, function (req, res) {
    const radius = Int(req.params.radius);
    const creationDate = new Date();

    const departPosition = new positionSchema({
        lat: req.body.departPositionLong,
        long: req.body.departPositionLat,
    });

//contraints
    let contraints = [];
    req.body.contraints.forEach(({contraint, positionLong, positionLat}) => {
        const newPosition = new positionSchema({
            lat: positionLong,
            long: positionLat,
        });
        const newContraint = new ContraintSchema({
            contraint: contraint,
            position: newPosition
        });
        contraints.appendChild(newContraint);
    });
//managers
    let managers = [];
    req.body.managers.forEach((manager) => {
        managers.appendChild(manager)
    });
//observators
    let observators = [];
    req.body.observators.forEach((observator) => {
        observators.appendChild(observator)
    });
    if (req.body.name) {
        const project = new ProjectModel({
            name: req.body.name,
            description: req.body.description,
            departCoordinates: departPosition,
            departAddress: req.body.departAddress,
            radius: radius,
            contraints: contraints,
            company: req.body.company, 
            managers: managers,
            observators: observators,
            creationDate: creationDate,
            lastEdit: creationDate
    
        });
        project.save().then(project => {
            res.status(201).json(project);
        }).catch( err => {
            res.status(500).send('project not saved');
        })
    } else {
        res.status(400).send('missing required fields');
    }

});

module.exports = router;