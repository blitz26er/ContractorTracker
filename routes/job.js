var config = require('../config');
var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Job = require('../models/job');
var User = require('../models/user');
var async = require('async');

// ----------------------------------------------------
router.route('/job_company')
    .get(function(req, res, next) {
        var item = req.query;
        Company.find(item, function(err, companies) {
            if(err) {
                return next(err);
            }
            var company_items = [];
            var count = companies.length;
            if(count == 0) {
                return res.json(company_items);
            }
            for(var i=0; i<companies.length; i++) {
                var ret;
                var company = companies[i];
                Job.findOne({company_id:company._id, user_id:req.profile._id}, function(err, job) {
                    count--;
                    company_item = company.toObject();
                    if(job != null) {
                        company_item.job_id = job._id;
                    }
                    company_items.push(company_item);
                    if(count == 0) {
                        res.json(company_items);
                    }
                });
            }
        });
    });

router.route('/job')

    // create a job (accessed at POST /)
    .post(function(req, res, next) {
        Company.findById(req.body.company_id, function(err, company) {
            if(err) {
                err.message = 'Cannot find company';
                return next(err);
            }

            if(company == null) {
                return next(new Error('Cannot find company'));
            }

            var job = new Job({
                no: company.no, 
                name: company.name, 
                description: company.description, 
                company_id: company._id,
                user_id: req.profile._id
            });

            job.save(function(err) {
                if(err) {
                    err.message = 'Cannot register the job.';
                    return next(err);
                }

                var job_item = job.toObject();
                job_item.message = 'Job registered successfully.';
                job_item.success = true;
                res.json(job_item);
            });
        });
    })

    .get(function(req, res, next) {
        var item = req.query;
        item['user_id'] = req.profile['_id'];
        Job.find(item, function(err, jobs) {
            res.json(jobs);
        });
    });

router.route('/job/:id')

	// get the job with that id (accessed at job/:id)
	.get(function(req, res, next) {
	    Job.findById(req.params.id, function(err, job) {
	        if (err) {
                err.message = 'Cannot get job.';  
                return next(err);
            }
            Task.find({job_id: req.params.id}, function(err, tasks) {
                if(err) {
                    err.message = 'Cannot get task.';
                    return next(err);
                }
                var job_item;
                try {
                    job_item = job.toObject();
                } catch(err) {
                    err.message = 'Cannot get job.';
                    return next(err);
                }
                job_item.tasks = tasks;
                res.json(job_item);
            });
		});
	})

	// update the job with this id (accessed at PUT job/:id)
	.put(function(req, res, next) {
	    Job.findById(req.params.id, function(err, job) {
	        if (err) {
                err.message = 'Submitted data is incorrect.';
	            return next(err);
            }

	        job.set(req.body);
	        // save the job
	        job.save(function(err) {
	            if (err) {
                    err.message = 'Cannot update the job.';
                    return next(err);
                }
                var job_item = job.toObject();
                job_item.success = true;
                job_item.message = 'Job updated successfully.';
	            res.json(job_item);
	        });
	    });
    })

    // delete the job with this id (accessed at DELETE job/:id)
    .delete(function(req, res, next) {
        Job.remove({
            _id: req.params.id
        }, function(err, job) {
            if (err) {
                err.message = 'Cannot delete job.';
                return next(err);
            }
            res.json({success: true, message:'Job deleted successfully.'});
        });
    });

module.exports = router;