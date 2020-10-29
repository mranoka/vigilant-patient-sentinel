require('dotenv').config();
const Users = require('../models/users.model.js');
const jwt = require('jsonwebtoken');


// verfies password and username entered by user by comparing them to those in database
// generates signature and sends token as response
exports.usersFind = function (req, res, next) {
    let sentinel1 = 0;
    const inf = req.params.info.split(',');
    const pass = inf[1];
    const usr = inf[0];
    // if Admin logs in, admin in payload is set to true 
    // if patient/user logs in, admin is set to false
    if (usr === 'Admin' && pass === 'boss55') {
        payload = {
            'username': usr,
            'admin': true  
        }
        const token = jwt.sign(JSON.stringify(payload), `${process.env.KEY_JWT}`, { algorithm: 'HS256' });
        res.send({ 'token': token });
    } else {
        Users.find({ admin: false }, function (err, users) {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Some error occurred while retrieving Patients list. Sorry :|" });
            } else {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username === usr && users[i].password === pass) {
                        sentinel1 = 1;
                    }
                }
                if (sentinel1 === 1) {
                    Users.findOne({ username: usr }, (err, docs) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send({ message: "Some error occurred while retrieving patient information. Sorry :|" });
                        } else {
                            // checks if password in found document matches entered password
                            if (pass === docs.password) {
                                payload = {
                                    'username': usr,
                                    'admin': false,
                                    'id_number': docs.id_number
                                }
                                const token = jwt.sign(JSON.stringify(payload), `${process.env.KEY_JWT}`, { algorithm: 'HS256' });
                                res.send({ 'token': token })
                            }
                        }
                    })
                } else {
                    res.send({ "error": "authentication failed" })
                }
            }
        })
    }
}