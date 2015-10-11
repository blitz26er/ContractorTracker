var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var validator = require('validator');
var router = express.Router();
var arc4 = require('arc4');
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

router.route('/verify/:id/:timestamp').
	get(function(req, res, next) {
		User.findById(req.param, function(err, user) {
			if(err) {
				timestamp_decipher = arc4('arc4', config.secret);
				var timestamp = timestamp_decipher.decodeString(req.param.timestamp);
				var currentDate = new Date();
				var sendDate = new Date(timestamp);
				var diff = currentDate.getTime()-sendDate.getTime();
				if(diff>1000*60*30) {
					return res.render('/views/verify', {message: 'The request is not vaild. Please try again.'});
				}
				
				var decipher = arc4('arc4', timestamp);
				var id = decipher.decodeString(req.param.id);
				User.findById(id, function(err, user) {
					if(err || user == null) {
						return res.render('/views/verify', {message: 'Request not verify.'});
					}
					user.active = true;
					user.save(function(err) {
						if(err) {
							return res.render('/views/verify', {message: 'Request not verify.'});
						}
						return res.render('/views/verify', {message: 'Verify user successfully.'});
					});
				})
			}
		})
	})

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
	    	// 			var sendgrid = require('sendgrid')(config.sendgrid.api_key);
	    	// 			var email = sendgrid.Email({
	    	// 				to: user.email,
	    	// 				from: 'blitz26er@gmail.com',
	    	// 				subject: 'Email Verification',
	    	// 				text: 'What are is?'
	    	// 			});

	    	// 			sendgrid.send(email, function(err, json) {
						//   if (err) { return console.error(err); }
						//   console.log(json);
						// });
	    				// var html = '<h1>Email Verification</h1>';
	    				// html += '<a href="'+req.protocol+'://'+req.get('host')+'/signing/verify/'+encrypt_id+'/'+encrypt_timestamp;
	    				// html += '">Verify email address</a>';
	    				// email.html = html;

	    				var currentDate = new Date();
	    				var timestamp_cipher = arc4('arc4', config.secret);
	    				var timestamp = currentDate.toString(); 
	    				var encrypt_timestamp = timestamp_cipher.encodeString(timestamp);
	    				var cipher = arc4('arc4', timestamp);
	    				var encrypt_id = cipher.encodeString(user._id);
	    				console.log(config.sendgrid.api_key);
	    				
	    				
	    				res.json({success: true, message: 'Register success.'});
	    			}
	    		});
	    	} else {
	    		return next(new Error('User email already exists.'));
	    	}
	    });
	});
module.exports = router;