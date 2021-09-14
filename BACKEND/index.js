//SETUP / INITIALIZE
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const bodyParser = require('body-parser');
const authRouter = require('./Routes/authRoutes.js')
const userRouter = require('./Routes/userRoutes.js')

//MONGOOSE
mongoose.connect("mongodb+srv://sitpi:" + process.env.DB_PASS + "@cluster.hxvcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', error => console.log('Connected to Mongoose'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/models', express.static(__dirname + '/models'));

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.get('*', function (req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
    res.type('txt').send('Not found');
  });

  app.listen(process.env.PORT || 80, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server started on port: " +  process.env.PORT || 80);
  })