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
        var item = req.body;
        item['user_id'] = req.profile['_id'];
        var job = new Job(req.body);    // create a new instance of the Job model
        
        // save the company and check for errors
        job.save(function(err) {
            if (err) {
                return next(err);
            }
            var company_item;
            try {
                company_item = company.toObject();
            } catch(err) {
                err.message = 'Cannot create job.';
                return next(err);
            }
            res.json(company_item);
        });
        
    })

    .get(function(req, res, next) {
        var item = req.body;
        item['user_id'] = req.profile['_id'];
        Job.find(item, function(err, jobs) {
            res.json(jobs);
        });
    });

router.route('/job/:id')

	// get the company with that id (accessed at company/:id)
	.get(function(req, res, next) {
	    Job.findById(req.params.id, function(err, company) {
	        if (err) {
                err.message = 'Cannot get job.';  
                return next(err);
            }
            Task.find({job_id: req.params.id}, function(err, tasks) {
                if(err) {
                    err.message = 'Cannot get task.';
                    return next(err);
                }
                var company_item;
                try {
                    company_item = company.toObject();
                } catch(err) {
                    err.message = 'Cannot get job.';
                    return next(err);
                }
                company_item.tasks = tasks;
                res.json(company_item);
            });
		});
	})

	// update the company with this id (accessed at PUT company/:id)
	.put(function(req, res, next) {
	    Company.findById(req.params.id, function(err, company) {
	        if (err) {
                err.message = 'Submitted data is incorrect.';
	            return next(err);
            }

	        company.set(req.body);
	        // save the company
	        company.save(function(err) {
	            if (err) {
                    err.message = 'Cannot update the company.';
                    return next(err);
                }
                var company_item = company.toObject();
                company_item.success = true;
                company_item.message = 'Company updated successfully.';
	            res.json(company);
	        });
	    });
    })

    // delete the Company with this id (accessed at DELETE company/:id)
    .delete(function(req, res, next) {
        Company.remove({
            _id: req.params.id
        }, function(err, company) {
            if (err) {
                err.message = 'Cannot delete company.';
                return next(err);
            }
            res.json({success: true, message:'Company deleted successfully.'});
        });
    });

module.exports = router;