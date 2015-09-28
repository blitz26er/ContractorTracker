var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var validator = require('validator');
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
	    		res.status(500).json({success: false, message: 'Authentication failed. User not found.'});
	    	} else {
	    		if (user.password != req.body.password) {
	    			res.status(500).json({success: false, message: 'Authentication failed. Wrong password.'});
	            } else {
	            	var token = jwt.sign(user, config.secret, {
	                    expiresInMinutes: 1440 // expires in 24 hours
	                });
		    		res.json({
						success: true,
		                message: 'Authentication succeded.',
		                access_token: token
		            });
                }
	    	}
	    });
	});

router.route('/signout').
	get(function(req, res) {
    	res.json({
    		success: true,
    		message: 'Signout succeded.'
    	});
	});

router.route('/signup').
	post(function(req, res) {
		var item = req.body;

		if(validator.isNull(item.firstname)) {
			res.status(500).json({success: false, message: 'Firstname cannot be blank.'});
			return;
		}

		if(validator.isNull(item.lastname)) {
			res.status(500).json({success: false, message: 'Lastname cannot be blank.'});
			return;
		}

		if(validator.isNull(item.email)) {
			res.status(500).json({success: false, message: 'Email cannot be blank.'});
			return;
		}

		if(validator.isEmail(item.emial)) {
			res.status(500).json({success: false, message: 'Email is not valid.'});
			return;
		}

		if(validator.isNull(item.password)) {
			res.status(500).json({success: false, message: 'Password cannot be blank.'});
			return;
		}

		User.findOne({
	        email: item.email
	    }, function(err, user) {
	    	if(!user) {
	    		user = new User(item);
	    		user.save(function(err) {
	    			if(err) {
	    				res.status(500).json({success: false, message: 'Register fail.'});
	    			} else {
	    				res.json({success: true, message: 'Register success.'});
	    			}
	    		});
	    	} else {
	    		res.status(500).json({success: false, message: 'User email already exist.'});
	    	}
	    });
	});
module.exports = router;