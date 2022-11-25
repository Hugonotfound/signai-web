const express = require('express');
const router = express.Router();
const UserModel = require('../Models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', function (req, res) {
    const {
        email,
        password,
        firstname,
        name,
        type,
        phone,
        company,
    } = req.body;
    console.log(email)
    console.log(type)
    if (type == 'manager' || type == 'observator') {
        UserModel.findOne({ email: email}).then( user => {
            if (user) {
                res.status(409).send('User already registered.');
            } else {
                const newUser = new UserModel({
                    email,
                    password,
                    firstname,
                    name,
                    type,
                    phone,
                    company,
                });
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => {
                        res.status(201).json(newUser);
                    }).catch( err => {
                        res.status(500).send('Error during registration.');
                    })
                })
                )
            }
        })
    } else {
        res.status(400).send('Type of user not supported. = ' + type);
    }

})

router.post('/login', (req, res) => {
    const {
        email,
        password,
    } = req.body;

    UserModel.findOne({ email: email}).then( user => {
        if (!user) {
            res.status(400).send('No user found with this email.')
        } else {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1 days'})
                    res.status(200).json({accessToken: accessToken});
                } else {
                    res.status(400).send('password incorrect');
                }
            });
        }
    }).catch(err => {
        res.status(501).send('error during logging');
    });
})

module.exports = router;