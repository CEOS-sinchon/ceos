var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var async = require('async');
var decryptHelper = require('../helper/DecryptHelper.js');
var userDAO = require('../model/UserDAO.js');


passport.use( new localStrategy({
        usernameField: 'id',
        passwordField: 'pass'
      } , function(id, password, done) {
    	  async.series([function(callback){
        	  userDAO.findUserByID(id , callback);
    	  }], function(err , result){
    		  if(result[0]==''){
    			  return done(null, false);
    		  } else{
    	        	if(decryptHelper.decryption(result[0][0].password)== password){
    	        		  delete result[0][0].password;
    	    	          return done(null, result[0][0]);
    	        		
    	        	} else{
    	        		return done(null, false);
    	        	}
    		  }
    	  });      
      }
));

passport.serializeUser( function(user, done) {
    console.log('serialize');
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserialize');
    done(null, user);
});

exports.passport = passport;