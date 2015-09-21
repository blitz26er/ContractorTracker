var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var router = express.Router();
// ==================================================================
// Signin, Signout
// ==================================================================
var User = require('../models/user');
router.route('/signin').
	post(function(req, res) {
	    User.findOne({
	        email: req.body.email
	    }, function(err, user) {
	    	if(!user) {
	    		res.json({success: false, message: 'Authentication failed. User not found.'});
	    	} else {
	    		if (user.password != req.body.password) {
	                res.json({success: false, message: 'Authentication failed. Wrong password.'});
	            } else {
	            	var token = jwt.sign(user, config.secret, {
	                    expiresInMinutes: 1440 // expires in 24 hours
	                });
		    		req.session.user = user;
					res.cookie('access_token', token, {maxAge: 60*1440});
		    		res.json({
						success: true,
		                message: 'Authentication succeded.',
		            });
                }
	    	}
	    	
	    });
	});

router.route('/signout').
	get(function(req, res) {
	    console.log(req.session.user);
	    res.clearCookie('access_token');
	    req.session.destroy(function(err) {
	    	// cannot access session here
	    	res.json({
	    		success: true,
	    		message: 'Signout succeded.'
	    	});
	  	});
	});

module.exports = router;