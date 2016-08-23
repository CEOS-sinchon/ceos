var base = require('./BaseDAO.js');
var mysql = require('mysql');



exports.findUserByID = function(userID, callback) {
	var sqlQuery = 'SELECT * from user WHERE id = ' + mysql.escape(userID);
	base.select(sqlQuery, callback);
};

exports.register = function(userInfo , callback){
	var sqlQuery = 'INSERT INTO user set ?'
	base.insert(sqlQuery, userInfo, callback);
}

exports.findUserList = function(callback){
	var sqlQuery = 'SELECT name , birth_date , phone_number , email , univ, major, field, profile_image FROM user'
	base.select(sqlQuery , callback);
};

exports.findUserByName = function(search, callback){
	var sqlQuery = 'SELECT uid FROM user WHERE name LIKE "%' + search +'%"';
	base.select(sqlQuery , callback);
}

exports.findWriter = function(boardArr , callback){
	var sqlQuery = 'SELECT uid , name from user WHERE '
	for(var i = 0 ; i <boardArr.length ; i++){
		sqlQuery = sqlQuery + '( uid = ' + mysql.escape(boardArr[i].writer) +' ) OR '
	}
	sqlQuery = sqlQuery.substring(0 , sqlQuery.length -4);
	base.select(sqlQuery , callback);
}