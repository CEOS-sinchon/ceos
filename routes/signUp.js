var express = require('express');
var mysql = require('mysql');
var userDAO = require('../model/UserDAO')
var router = express.Router();
var encryptHelper = require('../helper/EncryptHelper');
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('ceos_register' , {});
});

router.post('/' , function(req , res , next){
	var inform = {};
	var tempPass = encryptHelper.encryption(req.body.pass).toString();
	async.waterfall([function(callback){
		userDAO.findUserByID(req.body.id , callback);
	} , function(args1 , callback){
		if(args1.length!==0){
			callback('exist' , false);
		} else{
			inform = {
					'id' : req.body.id,
					'password' : tempPass,
					'name' : req.body.name,
					'en_name' : "",
					'birth_date' : new Date(),
					'phone_number' : req.body.phone,
					'email' : req.body.email,
					'univ' : req.body.univ,
					'major' : req.body.major,
					'univ_id' : req.body.univ_id,
					'field' : 3,
					'verify_code' : req.body.verify
			}
			userDAO.register(inform , callback);
		}
	}] , function(err , result){
		if(err=='exist'){
			res.send('이미 가입된 회원');
			//회원 존재할때
		} else if(err!==null){
			res.send('내부  서버오류');
			//내부서버오류
		} else{
			res.send('회원가입 완료');
		}
	});
});

module.exports = router;
