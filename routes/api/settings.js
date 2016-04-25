/**
 * Created by pavtr_000 on 11.03.2016.
 */
var async = require('async'),
  error = require('./../../libs/error'),
  express = require('express'),
  router = express.Router();

router.get('/getSettings', function (req, res, next) {
  getSettings(req, function (err, result) {
    if(err) {
      next(error(500, 'get settings error'));
    } else {
      res.send(result);
    }
  })

});

function getSettings (req, callback){
  var companyID = req.session.user.id_company,
    departmentList = [],
    jobList = [];

  req.models.departments.find({id_company: companyID}, function (err, departments) {
    if(err) {
      departmentList = null;
    } else {
      async.forEach(departments, function (department, cb) {
        departmentList.push(department.name);
        getJobsList(req, department.id_department, function (jobs) {
          async.forEach(jobs, function (job, callback) {
            jobList.push(job);
          })
          cb();
        })
      }, function () {
        var resultList = {
          departments: departmentList,
          jobs: jobList
        };
        callback(err, resultList);
      })
    }
  })
}

function getJobsList (req, departmentID, callback){
  req.models.job.find({id_department: departmentID}, function (err, jobs) {
    var jobList = jobs.map(function (job) {
      return job.name;
    });
    callback(jobList);
  })
}


module.exports = router;