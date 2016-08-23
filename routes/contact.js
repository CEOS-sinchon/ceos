var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.send('contact 페이지');
});


module.exports = router;