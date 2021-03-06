const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user.js');

const authenticateToken = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err) return res.sendStatus(403);
        req.email = email;
        next();
    });
};

function authenticateAdmin(req, res, next) {
    UserModel.findOne({email: req.email.email}).then( user => {
        if (user.type === 'admin') {
            next();
        } else {
            return res.sendStatus(403);
        }
    })
};

function authenticateManager(req, res, next) {
    UserModel.findOne({email: req.email.email}).then( user => {
        if (user.type === 'manager' || user.type === 'admin') {
            next();
        } else {
            return res.sendStatus(403);
        }
    })
};

module.exports = {authenticateToken, authenticateAdmin, authenticateManager};