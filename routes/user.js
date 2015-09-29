var config = require('../config');
var express = require('express');
var router = express.Router();
var User = require('../models/user');

// ----------------------------------------------------
router.route('/user')

    // get a user (accessed at GET /)
    .get(function(req, res, next) {
        var item = req.body;
        User.findById(req.profile['_id'], function(err, user) {
            if(err) {
                err.message = 'Cannot get user.';
                return next(err);
            }
            var user_item = user.toObject();
            delete user_item.password;
            res.json(user_item);
        });
    })

    // update a user (accessed at PUT /)
    .put(function(req, res, next) {
        var item = req.body;
        
        User.findById(req.profile['_id'], function(err, user) {
            user.set(req.body);

            // save the user and check for errors
            user.save(function(err) {
                if (err) {
                    err.message = 'Cannot update user.';
                    return next(err);
                }

                var user_item = user.toObject();
                delete user_item.password;
                user_item.success = true;
                user_item.message = 'User updated successfully.';
                res.json(user_item);
            });
        });
        
        
    })

    // delete the Company with this id (accessed at DELETE company/:id)
    .delete(function(req, res, next) {
        User.remove({
            _id: req.profile['_id']
        }, function(err, user) {
            if (err) {
                err.message = 'Cannot delete user.';
                return next(err);
            }
            res.json({success: true, message:'User deleted successfully.'});
        });
    });

module.exports = router;