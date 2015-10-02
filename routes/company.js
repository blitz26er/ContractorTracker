var config = require('../config');
var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Task = require('../models/task');
var Shortid = require('shortid');

// ----------------------------------------------------
router.route('/company')

    // create a company (accessed at POST /)
    .post(function(req, res, next) {
        var item = req.body;
        item['user_id'] = req.profile['_id'];
        item['no'] = Shortid.generate();
        var company = new Company(req.body);			// create a new instance of the Company model
        
        // save the company and check for errors
        company.save(function(err) {
            if (err) {
                return next(err);
            }
            var company_item;
            try {
                company_item = company.toObject();
            } catch(err) {
                err.message = 'Cannot create company.';
                return next(err);
            }
            company_item.success = true;
            company_item.message = 'Company created successfully.';
            company_item.tasks = [];
            res.json(company_item);
        });
    })

    .get(function(req, res, next) {
        var item = req.body;
        item['user_id'] = req.profile['_id'];
        Company.find(item, function(err, companies) {
            res.json(companies);
        });
    });

router.route('/company/:id')

	// get the company with that id (accessed at company/:id)
	.get(function(req, res, next) {
	    Company.findById(req.params.id, function(err, company) {
	        if (err) {
                err.message = 'Cannot get company.';  
                return next(err);
            }
            Task.find({company_id: req.params.id}, function(err, tasks) {
                if(err) {
                    err.message = 'Cannot get task.';
                    return next(err);
                }
                var company_item;
                try {
                    company_item = company.toObject();
                } catch(err) {
                    err.message = 'Cannot get company.';
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