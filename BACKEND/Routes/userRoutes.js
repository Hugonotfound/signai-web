const express = require('express');
const router = express.Router();
const UserModel = require('../Models/user.js');
const jwt = require('jsonwebtoken');
const user = require('../Models/user.js');

function authenticateToken(req, res, next) {
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

router.get('/info', authenticateToken, (req, res) => {
    UserModel.findOne({ email: req.email.email}).then( user => {
        if (!user) {
            res.status(200).send('No user found with this email.');
        } else {
            user.password = '';
            res.status(200).json(user);
        }
    })
});

router.get('/list', authenticateToken, authenticateAdmin, (req, res) => {
    UserModel.find().then( users => {
        res.status(200).json(users);
    })
});

module.exports = router;
