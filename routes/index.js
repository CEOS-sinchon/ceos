var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/fail' ,function(req,res,next){
	res.render('ceos_login' , {login : false});
});

router.get('/' , function(req , res , next){
	res.render('ceos_main' , {});
});

module.exports = router;

//main about board 자유 익명  sad qna , faq 다볼수있게  notice 풀고 
