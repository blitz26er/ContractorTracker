var config = require('../config');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Company = require('../models/company');


// ----------------------------------------------------
router.route('/home')
    // get a user (accessed at GET /)
    .get(function(req, res) {
        var user = User.findById(req.profile['_id'], function(err, user) {
            var key = {user_id: req.profile['_id']}; 
            Company.find(key, function(err, companies) {
                return res.json({user: user, companies: companies});
            });
        });
    });

module.exports = router;