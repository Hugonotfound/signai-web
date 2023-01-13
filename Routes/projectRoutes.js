const express = require("express");
const router = express.Router();
const Project = require("../Models/project");
const Comment = require("../Models/comments");
const sendMail = require("../Services/mailer");
const pdfService = require('../Configs/pdfBuilder');
var pdf = require('html-pdf');
const fetch = require("node-fetch");

const {
  authenticateToken,
  authenticateManager,
} = require("../Configs/auth.js");

function saveImageFromURL(url, filename) {
  var request = require('request').defaults({ encoding: null });
  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
      var base64Data = data.replace(/^data:image\/png;base64,/, "");
      require("fs").writeFile(filename, base64Data, 'base64', function (err) {
        console.log(err);
      });
    }
  });
}

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
        return (lat.toString().slice(0, 5) + ", " + lon.toString().slice(0, 5))
    } else
      return (lat.toString().slice(0, 5) + ", " + lon.toString().slice(0, 5))
  })
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

function pushToDB(req, res, newContraints) {
  console.log("newContraints =")
  console.log(newContraints)
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
  })
  newProject
    .save()
    .then((project) => {
      saveImageFromURL("https://v1.nocodeapi.com/sitpirajendran2/screen/oqCaczeIIUnAHfcO/screenshot?url=https://dashboard.signai.fr/map/" + project._id.toString() + "&inline=show&full_page=true&delay=60&viewport=1903x941", project._id.toString() + ".png")
      //sendMail("created", project.observators, project.name, project.id);
      res.status(201).send(project);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error);
    });
}

router.post("", authenticateToken, function (req, res) {
  let newContraints = [];
  let itemProcessed = 0;
  if (req.body.contraints != undefined && req.body.contraints.length > 0) {
    req.body.contraints.forEach(async (elem, index, array) => {
      let streetNameRes = await getStreetName(elem.latitude, elem.longitude)
      let newContraint = {
        type: elem.type,
        longitude: elem.longitude,
        latitude: elem.latitude,
        streetName: streetNameRes
      };
      console.log(newContraint)
      newContraints.push(newContraint);
      itemProcessed++;
      if(itemProcessed === array.length) {
        pushToDB(req, res, newContraints);
      }
      return newContraints;
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
        saveImageFromURL("https://v1.nocodeapi.com/sitpirajendran2/screen/oqCaczeIIUnAHfcO/screenshot?url=https://dashboard.signai.fr/map/" + project._id.toString() + "&inline=show&full_page=true&delay=60&viewport=1903x941", project._id.toString() + ".png")
        //sendMail("created", newProject.observators, newProject.name);
        res.status(201).send(project);
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
    return { ...elem, streetName: await getStreetName(elem.coordonateX, elem.coordonateY) }
  }));
  return new_data

}

router.post("/:id/result", authenticateToken, function (req, res) {
  if (req.params.id) {
    const filter = { _id: req.params.id };
    var update = { results: req.body.results };
    putStreetNameIntoResult(update).then((data) => {
      data = { "results": data };
      Project.findOneAndUpdate(filter, data).then((results) => {
        res.status(200).send(results);
        saveImageFromURL("https://v1.nocodeapi.com/sitpirajendran2/screen/oqCaczeIIUnAHfcO/screenshot?url=https://dashboard.signai.fr/map-results/" + results._id.toString() + "&inline=show&full_page=true&delay=30&viewport=1903x941", req.params.id + "-results.png")
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
    Project.findOne(filter).then((res) => {
      res.status(200).send(res);
    }).catch((err) => {
      res.status(500).send(err);
      console.log('err: ' + err)
    });
  }
});

router.post("/email", authenticateToken, function (req, res, next) {
  sendMail("finished", "thomas.dalem@epitech.eu", "toto");
  res.status(500).send("mail sent");
});

module.exports = router;

router.get("/pdf", function (req, res) {
  if (req.query.id) {
    Project.findById(req.query.id)
      .then((project) => {
        if (project.status == "finished") {
          const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            //          'Content-Disposition': `attachment;filename=invoice.pdf`,
          });
          pdfService.buildPDF(
            (chunk) => stream.write(chunk),
            () => stream.end(),
            project
          );
        }
        else {
          res.status(500).send("Project not finished");
        }
      })
      .catch((err) => {
        res.status(501).send(err);
      });
  } else {
    res.status(500).send("Id missing");
  }
});


module.exports = router;
