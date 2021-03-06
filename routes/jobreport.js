var config = require('../config');
var express = require('express');
var router = express.Router();
var JobReport = require('../models/jobreport');
var Job = require('../models/job');
var Company = require('../models/company');
var Task = require('../models/task');
var User = require('../models/user');
var dateFormat = require('date-format');

// ----------------------------------------------------
router.route('/job_report')
    // get a job reports(accessed at GET)
    .get(function(req, res, next) {
        var item = req.query;

        if(!item.report_date_from && !item.report_date_to) {
            return next(new Error('Please input the period.'));
        }
        item.report_date = {$gte: item.report_date_from, $lte: item.report_date_to};
        if(item.user_id == '') {
            delete item.user_id;
        }
        if(item.company_id == '') {
            delete item.company_id;
        }
        if(item.job_id == '') {
            delete item.job_id;
        }

        delete item.report_date_from;
        delete item.report_date_to;

        JobReport.find(item).sort({report_date: -1}).exec(function(err, jobreports) {
            if(err) {
                err.message = 'Cannot search job reports.';
                return next(err);
            }
            console.log(jobreports.length);
            res.json(jobreports);
        });
    })

    // create a job (accessed at POST /)
    .post(function(req, res, next) {
        var item = req.body;
        item.user_id = req.profile._id;
        Job.findById(item.job_id, function(err, job) {
            if(err) {
                err.message = 'Cannot exist the job.';
            }

            item.no = job.no;
            item.name = job.name;
            item.description = job.description;
            User.findById(item.user_id, function(err, user) {
                if(err) {
                    err.message = 'Cannot exist user.';
                    return next(err);
                }

                item.user_name = user.firstname+' '+user.lastname;
                
                var fee = 0;
                for(var i=0; i<item.tasks.length; i++) {
                    item.tasks[i].fee = item.tasks[i].rate*item.tasks[i].work_period;
                    fee += item.tasks[i].fee;
                }
                item.fee = fee;

                var jobreport = new JobReport(item);
                jobreport.save(function(err) {
                    if(err) {
                        err.message = 'Cannot create job report.';
                        return next(err);
                    }
                    jobreport_item = jobreport.toObject();
                    jobreport_item.message = 'Job report created successfully.';
                    jobreport_item.success = true;
                    res.json(jobreport_item);
                });
            });
            
        });
    });

router.route('/job_report_detail')
    
    // get a job report(accessed at GET)
    .get(function(req, res, next) {
        var item = req.query;
        if(!item.report_date || item.report_date == '') {
            item.report_date = dateFormat('yyyy-MM-dd', new Date());
        }
        item.user_id = req.profile._id;
        JobReport.findOne(item, function(err, jobreport) {
            if(err) {
                err.message = 'Job is not exist.';
                return next(err);
            }

            if(jobreport == null) {
                Job.findById(item.job_id, function(err, job) {
                    if(err) {
                        err.message = 'Job is not exist.';
                        return next(err);
                    } 
                    if(job == null) {
                        return next(new Error('Job is not exist.'));
                    }

                    Task.find({company_id: job.company_id}, function(err, tasks) {
                        if(err) {
                            return next(err);
                        }
                        var jobreport_item = job.toObject();
                        jobreport_item.report_date = item.report_date;
                        jobreport_item.job_id = jobreport_item._id;
                        delete jobreport_item._id;
                        jobreport_item.tasks = tasks;
                        res.json(jobreport_item);
                    });
                });
            } else {
                res.json(jobreport);
            }
        });
    });

router.route('/job_report/:id')

	// get the job with that id (accessed at job/:id)
	.get(function(req, res, next) {
	    JobReport.findById(req.params.id, function(err, jobreport) {
	        if (err) {
                err.message = 'Cannot get job.';  
                return next(err);
            }
            return res.json(jobreport);
		});
	})

	// update the job with this id (accessed at PUT job/:id)
	.put(function(req, res, next) {
	    JobReport.findById(req.params.id, function(err, jobreport) {
	        if (err) {
                err.message = 'Submitted data is incorrect.';
	            return next(err);
            }
            item = req.body;

            var fee = 0;
            for(var i=0; i<item.tasks.length; i++) {
                item.tasks[i].fee = item.tasks[i].rate*item.tasks[i].work_period;
                fee += item.tasks[i].fee;
            }
            item.fee = fee;
            jobreport.set(item);
                
	        // save the job
	        jobreport.save(function(err) {
	            if (err) {
                    err.message = 'Cannot update the job report.';
                    return next(err);
                }
                var job_item = jobreport.toObject();
                job_item.success = true;
                job_item.message = 'Job report updated successfully.';
	            res.json(job_item);
	        });
	    });
    })

    // delete the job with this id (accessed at DELETE job/:id)
    .delete(function(req, res, next) {
        JobReport.remove({
            _id: req.params.id
        }, function(err, job) {
            if (err) {
                err.message = 'Cannot delete job report.';
                return next(err);
            }
            res.json({success: true, message:'Job report deleted successfully.'});
        });
    });

module.exports = router;