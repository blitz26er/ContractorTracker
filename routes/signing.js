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
	            	var user_item = user.toObject();
	            	delete user_item.password;
	            	var token = jwt.sign(user_item, config.secret, {
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
	post(function(req, res, next) {
		var item = req.body;

		if(validator.isNull(item.firstname)) {
			return next(new Error('Firstname cannot be blank.'));
		}

		if(validator.isNull(item.lastname)) {
			return next(new Error('Lastname cannot be blank.'));
		}

		if(validator.isNull(item.email)) {
			return next(new Error('Email cannot be blank.'));
		}

		if(validator.isEmail(item.emial)) {
			return next(new Error('Email is not valid.'));
		}

		if(validator.isNull(item.password)) {
			return next(new Error('Password cannot be blank.'));
		}

		User.findOne({
	        email: item.email
	    }, function(err, user) {
	    	if(!user) {
	    		user = new User(item);
	    		user.save(function(err) {
	    			if(err) {
	    				err.message = 'Register fail.';
	    				return next(err);
	    			} else {
	    				res.json({success: true, message: 'Register success.'});
	    			}
	    		});
	    	} else {
	    		return next(new Error('User email already exists.'));
	    	}
	    });
	});
module.exports = router;