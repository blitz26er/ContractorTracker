var config = require('../config');
var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Task = require('../models/task');

// ----------------------------------------------------
router.route('/company')
    // create a company (accessed at POST /)
    .post(function(req, res) {
        var item = req.body;
        item['user_id'] = req.profile['_id'];
        var company = new Company(req.body);			// create a new instance of the Company model
        
        // save the company and check for errors
        company.save(function(err) {
            if (err)
                res.send(err);
            var company_item = company.toObject();
            company_item.success = true;
            company_item.message = 'Company created successfully.';
            res.json(company_item);
        });
        
    })

    .get(function(req, res) {
        var item = req.body;
        item['user_id'] = req.profile['_id'];
        Company.find(item, function(err, companies) {
            res.json(companies);
        });
    });

router.route('/company/:id')
	// get the company with that id (accessed at company/:id)
	.get(function(req, res) {
	    Company.findById(req.params.id, function(err, company) {
	        if (err)
	            res.send(err);
            var task_param = {company_id: company['_id']};
            Task.find(task_param, function(err, tasks) {
                if(err)
                    res.send(err);
                var company_item = company.toObject();
                company_item.tasks = tasks;
                res.json(company);
            });
		});
	})

	// update the company with this id (accessed at PUT company/:id)
	.put(function(req, res) {
	    Company.findById(req.params.id, function(err, company) {
	        if (err)
	            res.send(err);

	        company.set(req.body);
	        // save the company
	        company.save(function(err) {
	            if (err)
	                res.send(err);
	            res.json({success: true, message: 'Company updated'});
	        });
	    });
    })

    // delete the Company with this id (accessed at DELETE company/:id)
    .delete(function(req, res) {
        Company.remove({
            _id: req.params.id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({success: true, message:'Successfully deleted.'});
        });
    });

module.exports = router;