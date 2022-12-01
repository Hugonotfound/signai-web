//SETUP / INITIALIZE
const express = require('express');
var cors = require('cors');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const authRouter = require('./Routes/authRoutes.js');
const userRouter = require('./Routes/userRoutes.js');
const projectRouter = require('./Routes/projectRoutes.js');
const graphicRouter = require('./Routes/graphicRoutes.js');
const {sendMail} = require('./Services/mailer.js');
const cron = require('node-cron');
const Project = require('./Models/project');
const { authenticateToken } = require('./Configs/auth.js');
/* const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json')
const {sendMail} = require("./Configs/mailer.js")

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "SignAI Backend",
      description: "yes.",
      contact: {
        name: "Hugo Poisot"
      },
      servers: ["http://localhost:3001"]
    },
  },
  apis: ["app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
*/
//MONGOOSE
mongoose.connect("mongodb+srv://sitpi:" + process.env.DB_PASS + "@cluster.hxvcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', error => console.log('Connected to MongoDB database'));

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/models', express.static(__dirname + '/models'));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/graphic', graphicRouter);

function handleChangedProjects()
{
  Project.find().then(async function (res) {
    if (res) {
      for (let project of res) {
        if (project.status === "downloaded" && project.createdEmailSent == false) {
          console.log("Envoi email projet en cours");
          sendMail('starting', project.observators, project.name, project.id)
          Project.findOneAndUpdate(
            { _id: project.id},
            {
              $push: { createdEmailSent: true }
            }
          ).then((res) => {
            console.log('update')
          }).catch((err) => {
            console.log('pas update')
          })
        } else if (project.status === "finished" && project.finishedEmailSent == false) {
          console.log("Envoi email projet fini");
          sendMail('finished', project.observators, project.name, project.id)
          Project.findOneAndUpdate(
            { _id: project.id},
            {
              $push: { finishedEmailSent: true }
            }
          ).then((res) => {
            console.log('update')
          }).catch((err) => {
            console.log('pas update')
          })
        }
      }
    } else {
      console.error("Could not get project");
    }
  });
}

cron.schedule('*/30 * * * * *', handleChangedProjects);

/* const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "SignAI Backend",
      description: "yes.",
      contact: {
        name: "Hugo Poisot"
      },
      servers: ["http://localhost:3001"]
    },
  },
  apis: ["app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); */

app.get('/up', function (req, res, next) {
  if (req.accepts('html')) {
    res.status(200).send('Signai backend server is UP');
    return;
  }
  res.type('txt').send('Server is Up');
});

app.post('/email', authenticateToken, function(req, res, next) {
  if (req.body.mailType && req.body.emails && req.body.projectName && req.body.projectId) {
    res.status(400).send('email sent.');
    sendMail(req.body.mailType, req.body.emails, req.body.projectName, req.body.projectId)
  } else {
    res.status(500).send('missing args.');
  }
});

app.get('/.well-known/acme-challenge/cGd9VXi3TNq6qjpGABCJwayIoElX3U51FOedHK4xHgg', function (req, res, next) {
  res.type('txt').send('cGd9VXi3TNq6qjpGABCJwayIoElX3U51FOedHK4xHgg.ymHyYriGWiOLg7uU1TMIOmjA5XyvjR68FV2K-AlSkhg');
});

app.get('/.well-known/acme-challenge/NMByVpQS5YfzFQRWOSnnDHv0N5ms42m2qXAQ_4UegIA', function (req, res, next) {
  res.type('txt').send('NMByVpQS5YfzFQRWOSnnDHv0N5ms42m2qXAQ_4UegIA.ymHyYriGWiOLg7uU1TMIOmjA5XyvjR68FV2K-AlSkhg');
});

app.get('*', function (req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
      res.status(404).send('Url not found:' + req.url );
      return;
    }
    res.type('txt').send('Not found');
  });

module.exports = app;
