var cryptoJS = require('crypto-js');
var config = require('./config.js');

exports.decryption = function(input){
	var bytes  = cryptoJS.AES.decrypt(input.toString(), config.dbSecretKey);
	var result = bytes.toString(cryptoJS.enc.Utf8);
	return result;
}


