const express = require("express");
const router = express.Router();
const Project = require("../Models/project");
const Comment = require("../Models/comments");
const sendMail = require("../Services/mailer");
var pdf = require('html-pdf');
const fetch = require("node-fetch");

const {
  authenticateToken,
  authenticateManager,
} = require("../Configs/auth.js");

async function getStreetName(lat, lon) {
  var streetName = await fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&zoom=16', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }).then(async (response) => {
      var res = await response.text()
      if (response.ok) {
        if (res.indexOf('<road>') != -1)
          return res.slice(res.indexOf('<road>') + 6, res.indexOf('</road>'))
        else
          return (lat + ", " + lon)
    }})
  return streetName
}


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
        var options = { format: 'A4' };

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
  if (req.body.contraints != undefined) {
    req.body.contraints.forEach((elem, index, array) => {
      let status = false;
      if (index === array.length - 1){
        status = true;
      }
      getStreetName(elem.latitude, elem.longitude).then((streetNameRes) => {
        newContraint = {
          type: elem.type,
          longitude: elem.longitude,
          latitude: elem.latitude,
          streetName: streetNameRes
        };
        newContraints.push(newContraint);
        return newContraints;
      }).then((constraints) => {
        if (status == true) {
          const newProject = new Project({
            name: req.body.name,
            description: req.body.description,
            longitude: req.body.departPositionLong,
            latitude: req.body.departPositionLat,
            departAddress: req.body.departAddress,
            radius: req.body.radius,
            contraints: constraints,
            company: req.body.company,
            managers: req.body.managers,
            observators: req.body.observators,
            status: "created",
          })
          newProject
            .save()
            .then((project) => {
              res.status(201).send(project);
              sendMail("created", project.observators, project.name, project.id);
            })
            .catch((error) => {
              res.status(500).send(error);
            });
        }
      });
    });
  } else {
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      longitude: req.body.departPositionLong,
      latitude: req.body.departPositionLat,
      departAddress: req.body.departAddress,
      radius: req.body.radius,
      contraints: [],
      company: req.body.company,
      managers: req.body.managers,
      observators: req.body.observators,
      status: "created",
    })
    newProject
      .save()
      .then((project) => {
        res.status(201).send(project);
        sendMail("created", newProject.observators, newProject.name);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
});

router.delete("", authenticateToken, function (req, res) {
  Project.findOneAndDelete({ _id: req.query.id })
    .then((project) => {
      res.status(200).send("project deleted successfully");
    })
    .catch((err) => {
      res.status(500).send("error deleting project");
    });
});

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
        res.status(500).send("Intern error during push message");
      });
  } else {
    res.status(500).send("Missing id to post comment on project");
  }
});

router.get("/:id/comments", authenticateToken, function (req, res) {
  if (req.params.id) {
    Project.findById(req.params.id)
      .then((project) => {
        res.status(200).send(project.comments);
      })
      .catch((err) => {
        res
          .status(500)
          .send("Intern error during getting comments of this project");
      });
  } else {
    res.status(500).send("Missing id to get comments of project");
  }
});

router.delete("/:id/comment", authenticateToken, function (req, res) {
  if (req.params.id) {
    Project.findOneAndDelete({ _id: req.params.id })
      .then((project) => {
        res.status(200).send("project deleted successfully");
      })
      .catch((err) => {
        res.status(500).send("error deleting project");
      });
  } else {
    res.status(500).send("Missing id to delete result");
  }
});


async function putStreetNameIntoResult(data) {
  data = data.results;
  var new_data = await Promise.all(data.map(async (elem) => {
    return {...elem, streetName: await getStreetName(elem.coordonateX, elem.coordonateY)}
  }));
  return new_data

}

router.post("/:id/result", authenticateToken, function (req, res) {
  if (req.params.id) {
    const filter =  { _id: req.params.id };
    var update = { results: req.body.results };
    putStreetNameIntoResult(update).then((data) => {
      data = {"results": data};
      Project.findOneAndUpdate(filter, data).then((results) => {
        res.status(200).send(results);
      }).catch((err) => {
        res.status(500).send(err);
        console.log('err: ' + err)
      });
    });
  }
});

router.get("/:id/result", authenticateToken, function (req, res) {
  if (req.params.id) {
    const filter = { _id: req.params.id };
    Project.findOne(filter)
      .then((res) => {
        res.status(200).send(res.results);
      })
      .catch((err) => {
        res.status(500).send("intern error during getting result");
      });
  } else {
    res.status(500).send("Missing id to get result");
  }
});

router.post("/email", authenticateToken, function (req, res, next) {
  sendMail("finished", "thomas.dalem@epitech.eu", "toto");
  res.status(500).send("mail sent");
});

module.exports = router;
