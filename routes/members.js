var express = require('express');
var async = require('async');
var querystring = require('querystring');
var userDAO = require('../model/UserDAO');
var router = express.Router();


router.get('/',  function(req, res, next) {
	var target;
	if(req.url.length > 1){
		var qObj = querystring.parse(req.url.substring(2));
		if(qObj.order == undefined){
			target = 0;
		} else {
			target = qObj.order;
		}
	} else{
		target = 0;
	}
	async.waterfall([function(callback){
		userDAO.findUserTempList(target , callback);
	}] , function(err , result){
		res.render('member_all' , {result : result , order : target});
	});
});


module.exports = router;