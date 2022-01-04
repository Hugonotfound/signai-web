const express = require("express");
const router = express.Router();
const Project = require("../Models/project");
const {
  authenticateToken,
  authenticateManager,
} = require("../Configs/auth.js");

router.get("", authenticateToken, function (req, res) {
  if (req.query.id) {
    Project.findById(req.query.id)
      .then((projects) => {
        res.status(200).send(projects);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(500).send("Id missing");
  }
});

router.get("/list", authenticateToken, function (req, res) {
  if (req.query.company) {
    Project.find({ company: req.query.company }).then((projects) => {
      if (projects) {
        res.status(200).send(projects);
      } else {
        res.status(500).send("No projects found");
      }
    });
  } else {
    Project.find().then((projects) => {
      if (projects) {
        res.status(200).send(projects);
      } else {
        res.status(500).send("No projects found");
      }
    });
  }
});

router.post("", authenticateToken, function (req, res) {
  let newContraints = [];
  req.body.contraints.forEach(({ contraint, positionLong, positionLat }) => {
    newContraint = {
      contraint,
      position: {
        positionLong: positionLong,
        positionLat: positionLat,
      },
    };
    newContraints.appendChild(newContraint);
  });

  const newProject = new Project({
    name: req.body.name,
    description: req.body.description,
    departPositionLong: {
      long: req.body.departPositionLong,
      lat: req.body.departPositionLat,
    },
    departAddress: req.body.departAddress,
    radius: req.body.radius,
    contraints: newContraints,
    company: req.body.company,
    managers: req.body.managers,
    observators: req.body.observators,
  });
  newProject
    .save()
    .then((project) => {
      res.status(201).send(project);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;