var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.foundTotalNum = function(callback){
	var sqlQuery = 'SELECT count(*) from notice';
	base.select(sqlQuery , callback);
};

exports.foundBoardPage = function(pagingNum ,countTop ,callback , uid){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT nid , title , writer, content , written_time , view_num FROM notice ';
		if(uid !== undefined){
			sqlQuery = sqlQuery + ' WHERE writer = ' +mysql.escape(uid);
		}
		sqlQuery = sqlQuery + ' ORDER BY nid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
};

exports.addViewNum = function(nid , callback){
	var sqlQuery = 'UPDATE notice SET view_num = view_num + 1 WHERE nid = ' + mysql.escape(nid);
	base.update(sqlQuery , callback);
}

exports.findTagetBoardByBid= function (nid , callback){
	var sqlQuery = 'SELECT * FROM notice WHERE nid = ' + mysql.escape(nid);
	base.select(sqlQuery , callback);
}

exports.register = function(noticeInform , callback){
	var sqlQuery = 'INSERT INTO notice SET ?'
	base.insert(sqlQuery , noticeInform , callback);
}