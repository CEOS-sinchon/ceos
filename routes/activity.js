var express = require('express');
var router = express.Router();
var async = require('async');
var activityDAO = require('../model/ActivityDAO');

router.get('/', function(req, res){
	async.waterfall([function(callback){
		activityDAO.findActivity(callback);
	}] , function(err , result){
		res.send(result);
	});
});


module.exports = router;