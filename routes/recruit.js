var express = require('express');
var router = express.Router();



router.get('/apply', function(req, res){
	res.render('recruit_apply' , {});
});

router.get('/' , function(req, res){
	res.render('recruit_det' , {});
});

module.exports = router;