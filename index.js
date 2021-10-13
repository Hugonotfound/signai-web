const app = require('./app.js');

app.listen(process.env.PORT || 80, function (err) {
  if (err) console.log("Error in server setup")
  console.log("Server started on port: " +  process.env.PORT || 3001);
})