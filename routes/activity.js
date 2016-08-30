var express = require('express');
var router = express.Router();
var async = require('async');


router.get('/', function(req, res){
	res.render('activity',{});
});


module.exports = router;