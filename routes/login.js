var express = require('express');
var router = express.Router();
var passport = require('../web').passport;

router.post('/', passport.authenticate('local', { failureRedirect: '/fail' }),
			  function(req, res) {
				console.log(req.session);
			    res.redirect('/');
	});

router.get('/' , function(req, res, next){
	res.render('ceos_login' , {login : true});
});

module.exports = router;
