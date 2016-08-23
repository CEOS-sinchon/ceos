var express = require('express');
var router = express.Router();
var config = require('../helper/config.js');

/* GET home page. */
router.get('/',  function(req, res, next) {
		console.log("여긴오냐?");
	  req.logout();  // 세션 삭제
	  res.send('logout됨');
});

module.exports = router;
