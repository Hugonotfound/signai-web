const express = require("express");
const router = express.Router();
const Project = require("../Models/project");
const Comment = require("../Models/comments");
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
        return (lat.slice(0,5) + ", " + lon.slice(0,5))
    } else
      return (lat.slice(0,5) + ", " + lon.slice(0,5))
  })
  return streetName
}


router.get("", authenticateToken, function (req, res) {
  if (req.query.id) {
    Project.findById(req.query.id)
      .then((projects) => {
        saveImageFromURL("https://v1.nocodeapi.com/sitpirajendran/screen/LPCTNBUQbzFmPOuW/screenshot?url=https://dashboard.signai.fr/map/6387e3b27b99f1838c09e2e8&inline=show&full_page=true&delay=5&viewport=1903x941", project._id.toString() + ".png")
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
  if (req.body.contraints != undefined) {
    req.body.contraints.forEach((elem, index, array) => {
      let status = false;
      if (index === array.length - 1) {
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
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
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
//        saveImageFromURL("https://v1.nocodeapi.com/sitpirajendran/screen/LPCTNBUQbzFmPOuW/screenshot?url=https://dashboard.signai.fr/map-results/6387e3b27b99f1838c09e2e8&inline=show&full_page=true&delay=5&viewport=1903x941", req.params.id + ".png")
      }).catch((err) => {
        res.status(500).send(err);
        console.log('err: ' + err)
      });
    });
  }
})

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
})


router.get("/pdf", function (req, res) {
  if (req.query.id) {
    Project.findById(req.query.id)
      .then((project) => {
        const stream = res.writeHead(200, {
          'Content-Type': 'application/pdf',
          //          'Content-Disposition': `attachment;filename=invoice.pdf`,
        });
        pdfService.buildPDF(
          (chunk) => stream.write(chunk),
          () => stream.end(),
          project
        );
      })
      .catch((err) => {
        res.status(501).send(err);
      });
  } else {
    res.status(500).send("Id missing");
  }
});


module.exports = router;