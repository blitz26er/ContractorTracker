var config = require('../config');
var express = require('express');
var router = express.Router();
var User = require('../models/user');

// ----------------------------------------------------
router.route('/user')

    // get a user (accessed at GET /)
    .get(function(req, res) {
        var item = req.body;
        User.findById(req.profile['_id'], function(err, user) {
            res.json(user);
        });
    })

    // update a user (accessed at PUT /)
    .put(function(req, res) {
        var item = req.body;
        
        User.findById(req.profile['_id'], function(err, user) {
            user.set(req.body);

            // save the user and check for errors
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({success: true, message: 'User updated successfully.'});
            });
        });
        
        
    })
    // delete the Company with this id (accessed at DELETE company/:id)
    .delete(function(req, res) {
        User.remove({
            _id: req.profile['_id']
        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json({success: true, message:'User deleted successfully.'});
        });
    });

module.exports = router;