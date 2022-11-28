const app = require('./app.js');


/////////////////// A COMMENTER SI NON-PROD /////////////////////////////////////

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/backend.signai.fr/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/backend.signai.fr/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/backend.signai.fr/chain.pem', 'utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };

// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

// httpServer.listen(80, () => {
// 	console.log('HTTP Server running on port 80');
// });

// httpsServer.listen(443, () => {
// 	console.log('HTTPS Server running on port 443');
// });

////////////////////////////////////////////////////////

/////////////////// A ACTIVER SI NON-PROD /////////////////////////////////////

app.listen(process.env.PORT, function (err) {
  if (err) console.log("Error in server setup")
  console.log("Server started on port: " +  process.env.PORT || 80);
})


////////////////////////////////////////////////////////
