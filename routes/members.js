var express = require('express');
var async = require('async');
var userDAO = require('../model/UserDAO');
var router = express.Router();


router.get('/',  function(req, res, next) {
	async.waterfall([function(callback){
		userDAO.findUserList(callback);
	}] , function(err , result){
		if(err){
			consoel.log(err);
			res.send('내부서버오류');
		} else{
			res.send(result);
		}
		
	});
});



module.exports = router;