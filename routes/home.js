var config = require('../config');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Company = require('../models/company');
var Job = require('../models/job');
var JobReport = require('../models/jobreport');
var dateFormat = require('date-format');

// ----------------------------------------------------
router.route('/home')
    // get a user (accessed at GET /)
    .get(function(req, res, next) {
        var user = User.findById(req.profile['_id'], function(err, user) {
            var key = {user_id: req.profile['_id']}; 
            Company.find(key, function(err, companies) {
                Job.find(key, function(err, jobs) {
                    var user_item = user.toObject();
                    delete user_item.password;
                    res.json({user: user_item, companies: companies, jobs: jobs});
                });
            });
        });
    });

router.route('/home/recent')
    .get(function(req, res, next) {
        var currentDate = new Date();
        var lastWeekStartDate = new Date();
        var lastWeekEndDate = new Date();
        var thisWeekStartDate = new Date();
        var day = currentDate.getDay(),
            diff = currentDate.getDate()-day;
        lastWeekStartDate.setDate(diff-7);
        lastWeekEndDate.setDate(diff-1);
        thisWeekStartDate.setDate(diff); 
        var query = {user_id: req.profile._id, report_date: 
            {$gte: dateFormat('yyyy-MM-dd', lastWeekStartDate), $lte: dateFormat('yyyy-MM-dd', currentDate)}};
        
        JobReport.find(query).sort({report_date:-1}).exec(function(err, jobreports) {
            if(err) {
                err.message = 'Error has been occured';

                console.log(err);
                return next(err);
            }
            var list = [ {'title':'This Week', 
                            report_date_from: thisWeekStartDate,
                            report_date_to: currentDate,
                            jobs: []}, 
                        {'title':'Last Week', 
                            report_date_from: lastWeekStartDate,
                            report_date_to: lastWeekEndDate, 
                            jobs: []} ];


            for(var i=0, ni=jobreports.length; i<ni; i++) {
                var jobreport = jobreports[i];
                for(var j=0, nj=list.length; j<nj; j++) {
                    var item = list[j]; 
                    if(jobreport.report_date>=item.report_date_from && jobreport.report_date<=item.report_date_to) {
                        var jobs = item.jobs;
                        var job_exist = false;
                        var jobreport_item = jobreport.toObject();
                        for(var k=0, nk=jobs.length; k<nk; k++) {
                            var job = jobs[k];
                            if(job._id == jobreport.job_id) {
                                delete jobreport_item.name;
                                delete jobreport_item.description;
                                delete jobreport_item.job_id;
                                delete jobreport_item.company_id;
                                delete jobreport_item.user_id;
                                var tasks = jobreport_item.tasks;
                                var task_list = [];
                                for(l=0, nl<jobreport_item.tasks.length; l<nl; l++) {
                                    task = tasks[i];
                                    if(task.work_period != 0 && task.work_period != null && task.work_period != '') {
                                        task_list.push(task);
                                    }
                                }
                                jobreport_item.tasks = task_list;
                                job.jobreports.push(jobreport_item);
                                job_exist = true;
                                break;
                            }
                        }  
                        if(!job_exist) {
                            job = {_id: jobreport_item.job_id, no: jobreport_item.no, name: jobreport_item.name, 
                                description: jobreport_item.description};
                            delete jobreport_item.name;
                            delete jobreport_item.description;
                            delete jobreport_item.job_id;
                            delete jobreport_item.company_id;
                            delete jobreport_item.user_id;
                            job.jobreports = [jobreport_item];
                            jobs.push(job);
                        }
                        break;
                    }
                }
            }
            console.log(list);
            res.json(list);
        });
    });
module.exports = router;