const {ProjectModel, UserModel, ContraintSchema, positionSchema} = require('../Models/project.js');
const jwt = require('jsonwebtoken');
const req = require('express/lib/request');

const projectCalls = {

    async getProjectFromCompany(company) {
        ProjectModel.find({comany: company}).then( companys => {
            return companys
        }), (err) => {
            return 'No project founded'
        };
        return 'test';
    },
    async getProjectById(id) {
        ProjectModel.findOne({id: req.query.id}).then(project => {
            if (project) {
                return project
            } else {
                return 'No project found'
            }
        });
    },
    async updateProject(id, toChange) {
        const {
            name,
            value
        } = tochange;
        ProjectModel.findOneAndUpdate({id: id}, {name: value}).then(project => {
            return project
        })
    },
};

const UserCalls = {
    async getInfoByEmail(email) {
        UserModel.findOne({ email: email}).then( user => {
            if (user == null || user == '') {
                return'No user found with this email.';
            } else {
                user.password = '';
                return user
            }
        })
    },
    async getUsers() {
        UserModel.find().then( users => {
            return users;
        })
    }
};

const authCalls = {
    async connectUser(email, password) {
        UserModel.findOne({ email: email}).then( user => {
            if (!user) {
                return 'No user found with this email.'
            } else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1 days'})
                        return accessToken;
                    } else {
                        return 'password incorrect';
                    }
                });
            }
        }).catch(err => {
            return 'error during logging';
        });
    }
}

module.exports = projectCalls;