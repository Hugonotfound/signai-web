const express = require("express");
const router = express.Router();
const Project = require("../Models/project");
const Comment = require("../Models/comments");
var pdf = require('html-pdf');

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

router.get("/pdf", function (req, res) {

  if (req.query.id) {
    Project.findById(req.query.id)
      .then((projects) => {
        var htmlcontent = '<html><body><h2>' + projects.name + '</h2><p>Description : ' + projects.description + '</p><p>Entreprise :' + projects.company + '</p><p>' + projects.contraints + '</p><p>' + projects.results + '</p></body></html>';
        var options = { format: 'Letter' };

        pdf.create(htmlcontent, options).toBuffer(function (err, buffer) {
          res.status(200).send(buffer);
        });
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
  if (req.body.contraints != undefined)
    req.body.contraints.forEach((res) => {
      newContraint = {
        type: res.type,
        longitude: res.longitude,
        latitude: res.latitude,
      };
      newContraints.push(newContraint);
    });

  const newProject = new Project({
    name: req.body.name,
    description: req.body.description,
    longitude: req.body.departPositionLong,
    latitude: req.body.departPositionLat,
    departAddress: req.body.departAddress,
    radius: req.body.radius,
    contraints: newContraints,
    company: req.body.company,
    managers: req.body.managers,
    observators: req.body.observators,
    status: "created",
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

// router.put("", authenticateToken, function (req, res) {
//   if (req.query.id) {
//   } else {
//     res.status(500).send("Id misisng");
//   }
// });

router.delete("", authenticateToken, function (req, res) {
  Project.findOneAndDelete({ _id: req.query.id })
    .then((project) => {
      res.status(200).send("project deleted successfully")
    }).catch((err) => {
      res.status(500).send("error deleting project")
    })
})

router.post("/:id/comment", authenticateToken, function (req, res) {
  if (req.params.id) {
    comment = {
      author: req.body.author,
      date: req.body.date,
      message: req.body.message,
    };
    Project.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { comments: comment },
      }
    )
      .then((project) => {
        res.status(201).send(project.comments);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

router.get("/:id/comments", authenticateToken, function (req, res) {
  if (req.params.id) {
    Project.findById(req.params.id)
      .then((project) => {
        res.status(200).send(project.comments);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

router.delete("/:id/comment", authenticateToken, function (req, res) {
  if (req.params.id) {
    // Project.findOneAndDelete({ _id: req.params.id })
    //     .then((project) => {
    //         res.status(200).send("project deleted successfully")
    //     }).catch((err) => {
    //         res.status(500).send("error deleting project")
    //     })
  }
});

module.exports = router;
