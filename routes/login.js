var express = require('express');
var router = express.Router();
var passport = require('../web').passport;

router.post('/', passport.authenticate('local', { failureRedirect: '/fail',
												  failureFlash : true}),
			  function(req, res) {
			    res.redirect('/');
	});

router.get('/' , function(req, res, next){
	res.render('ceos_login' , {login : true});
});

module.exports = router;
