var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../config');

// get an instance of the router for api routes
var router = express.Router(); 

//route middleware to verify a token
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['access_token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.profile = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        return res.status(500).send({success: false, message: 'No token provided.'});
    }
});
module.exports = router;