var config = require('../config');
var express = require('express');
var router = express.Router();
var Task = require('../models/task');
var Company = require('../models/company');

// ---------------------------------------------------- 
router.route('/task')

    // create a task (accessed at POST /)
    .post(function(req, res, next) {
        var item = req.body;
        if(!item.company_id) {
            var err = new Error('Company is not defined.');
            return next(err);
        }

        Company.findById(item.company_id, function(err, company) {
            if(err || !company) {
                err = new Error('Cannot find the company');
                return next(err);
            } else {
                var task = new Task(item);     
                // save the task and check for errors
                task.save(function(err) {
                    if (err) {
                        err.message = 'Cannot create task.';
                        return next(err);
                    }
                    var task_item = task.toObject();
                    task_item.success = true;
                    task_item.message = 'Task created successfully.';
                    res.json(task_item);
                });
            }
        });
    })

    .get(function(req, res, next) {
        var item = req.query;
        Task.find(item, function(err, tasks) {
            if(err) {
                err.message = 'Cannot find tasks.';
                return next(err);
            }
            res.json(tasks);
        });
    });

router.route('/task/:id')

	// get the task with that id (accessed at task/:id)
	.get(function(req, res, next) {
	    Task.findById(req.params.id, function(err, task) {
	        if (err) {
                err.message = 'Cannot get task.';
	            return next(err);
            }
            res.json(task);
		});
	})

	// update the task with this id (accessed at PUT task/:id)
	.put(function(req, res, next) {
	    Task.findById(req.params.id, function(err, task) {
	        if (err) {
                err.message = 'Cannot update task.';
	            next(err);
            }

	        task.set(req.body);
	        // save the task
	        task.save(function(err) {
	            if (err) {
                    err.message = 'Cannot update task.';
	                return next(err);
                }
                var task_item = task.toObject();
                task_item.success = true;
                task_item.message = 'Task created successfully.';
                res.json(task_item);
	        });
	    });
    })

    // delete the Task with this id (accessed at DELETE task/:id)
    .delete(function(req, res, next) {
        Task.remove({
            _id: req.params.id
        }, function(err, task) {
            if (err) {
                err.message = 'Cannot delete task.';
                return next(err);
            }
            res.json({success: true, message:'Task deleted successfully.'});
        });
    });

module.exports = router;