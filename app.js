//SETUP / INITIALIZE
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const bodyParser = require('body-parser');
const authRouter = require('./Routes/authRoutes.js')
const userRouter = require('./Routes/userRoutes.js');
const projectRouter = require('./Routes/projectRoutes.js')

//MONGOOSE
mongoose.connect("mongodb+srv://sitpi:" + process.env.DB_PASS + "@cluster.hxvcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', error => console.log('Connected to MongoDB database'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/models', express.static(__dirname + '/models'));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);

app.get('*', function (req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
      res.status(404).send('Url not found:' + req.url );
      return;
    }
    res.type('txt').send('Not found');
  });

module.exports = app;