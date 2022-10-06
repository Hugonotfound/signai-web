const express = require('express');
const router = express.Router();
const UserModel = require('../Models/user.js');
const {GraphicRoad, GraphicTrip} = require('../Models/graphic');
const {
    authenticateToken,
  } = require("../Configs/auth.js");



  router.get("/road/:id", authenticateToken, function(req, res) {
    if (req.params.id) {
      const filter = {project_id: req.params.id};
      GraphicRoad.findOne(filter).then((resultat) => {
        res.status(200).send(resultat);
      }).catch((err) => {
        res.status(500).send(err);
      })
    }
  });

  router.post("/road", authenticateToken, function(req, res) {
    if (req.body.project_id && req.body.data) {
        const newGraph = new GraphicRoad({
            project_id: req.body.project_id,
            data: req.body.data,
        });
        newGraph
            .save()
            .then((graph) => {
                res.status(200).send(graph)
            })
            .catch((err) => {
                res.status(500).send('Problem during saving new graphic');
            });
    } else {
        res.status(500).send('missing content in body');
    }
  });

  router.get("/trip/:id", authenticateToken, function(req, res) {
    if (req.params.id) {
      const filter = {project_id: req.params.id};
      GraphicTrip.findOne(filter).then((resultat) => {
        if (resultat) {
            res.status(200).send(resultat);
        } else {
            res.status(500).send('item not in db')
        }
      }).catch((err) => {
        res.status(500).send(err);
      })
    }
  });

  router.post("/trip", authenticateToken, function(req, res) {
    if (req.body.project_id && req.body.data) {
        const newGraph = new GraphicTrip({
            project_id: req.body.project_id,
            data: req.body.data,
        });
        newGraph
            .save()
            .then((graph) => {
                res.status(200).send(graph)
            })
            .catch((err) => {
                res.status(500).send('Problem during saving new graphic');
            });
    } else {
        res.status(500).send('missing content in body');
    }
  });

  module.exports = router;