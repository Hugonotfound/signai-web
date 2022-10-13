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
/* const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerDocument = require('./swagger.json') */
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

app.get('/.well-known/acme-challenge/n0h5mrqM1sdo3OiQNUOHlA5OrLev7iYw_ly6dFbeXRo', function (req, res, next) {
  if (req.accepts('html')) {
    res.status(200).send('n0h5mrqM1sdo3OiQNUOHlA5OrLev7iYw_ly6dFbeXRo.ymHyYriGWiOLg7uU1TMIOmjA5XyvjR68FV2K-AlSkhg');
    return;
  }
  res.type('txt').send('n0h5mrqM1sdo3OiQNUOHlA5OrLev7iYw_ly6dFbeXRo.ymHyYriGWiOLg7uU1TMIOmjA5XyvjR68FV2K-AlSkhg');
});

app.get('/.well-known/acme-challenge/7T4eyn3Cxh6ETDrfyXcQ0jm1WCkh13Oz49TVSUowIb0', function (req, res, next) {
  if (req.accepts('html')) {
    res.status(200).send('7T4eyn3Cxh6ETDrfyXcQ0jm1WCkh13Oz49TVSUowIb0.ymHyYriGWiOLg7uU1TMIOmjA5XyvjR68FV2K-AlSkhg');
    return;
  }
  res.type('txt').send('7T4eyn3Cxh6ETDrfyXcQ0jm1WCkh13Oz49TVSUowIb0.ymHyYriGWiOLg7uU1TMIOmjA5XyvjR68FV2K-AlSkhg');
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