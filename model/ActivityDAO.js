var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.findActivity = function(callback){
	var sqlQuery = 'SELECT * FROM activity';
	base.select(sqlQuery , callback);
}