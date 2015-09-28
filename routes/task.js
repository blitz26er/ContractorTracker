var config = require('../config');
var express = require('express');
var router = express.Router();
var Task = require('../models/task');

// ---------------------------------------------------- 
router.route('/task')

    // create a task (accessed at POST /)
    .post(function(req, res, next) {
        var item = req.body;
        var task = new Task(req.body);			// create a new instance of the Task model
        
        // save the task and check for errors
        task.save(function(err) {
            if (err) {
                err.message = 'Cannot create task.';
                next(err);
            }
            var task_item = task.toObject();
            task_item.success = true;
            task_item.message = 'Task created successfully.';
            res.json(task_item);
        });
        
    })

    .get(function(req, res, next) {
        var item = req.body;
        Company.find(item, function(err, tasks) {
            if(err) {
                err.message = 'Cannot find tasks.';
                next(err);
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
	            next(err);
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
	                next(err);
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
                next(err);
            }
            res.json({success: true, message:'Task deleted successfully.'});
        });
    });

module.exports = router;