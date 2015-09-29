var config = require('../config');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Company = require('../models/company');


// ----------------------------------------------------
router.route('/home')
    // get a user (accessed at GET /)
    .get(function(req, res, next) {
        var user = User.findById(req.profile['_id'], function(err, user) {
            var key = {user_id: req.profile['_id']}; 
            Company.find(key, function(err, companies) {
            	var user_item = user.toObject();
            	delete user_item.password;
                return res.json({user: user_item, companies: companies});
            });
        });
    });

module.exports = router;