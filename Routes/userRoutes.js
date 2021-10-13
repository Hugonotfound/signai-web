const express = require('express');
const router = express.Router();
const UserModel = require('../Models/user.js');

const {authenticateToken, authenticateAdmin} = require('../Configs/auth.js');



router.get('/info/me', authenticateToken, (req, res) => {
    UserModel.findOne({ email: req.email.email}).then( user => {
        if (user == null || user == '') {
            res.status(400).send('No user found with this email.');
        } else {
            user.password = '';
            res.status(200).json(user);
        }
    })
});

router.get('/info', authenticateToken, (req, res) => {
    UserModel.findOne({ email: req.body.email}).then( user => {
        if (user == null || user == '') {
            res.status(400).send('No user found with this email.');
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
