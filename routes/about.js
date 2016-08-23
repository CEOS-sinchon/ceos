var express = require('express');
var router = express.Router();

router.get('/greet', function(req, res){
	res.render('about_greet' , {});
});

router.get('/history' , function(req , res){
	res.render('about_history' , {});
});

router.get('/manage' , function(req , res){
	res.render('about_manage' , {});
});

router.get('/philo' , function(req , res){
	res.render('about_philo' , {});
});

router.get('/mentor', function(req , res){
	res.render('about_mentor' , {});
});

module.exports = router;