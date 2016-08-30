var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.foundTotalNum = function(callback){
	var sqlQuery = 'SELECT count(*) from anony';
	base.select(sqlQuery , callback);
};

exports.foundBoardPage = function(pagingNum ,countTop ,callback ){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT anid , title , written_time , content , view_num FROM anony ORDER BY anid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
};

exports.getAnonyReplyNum = function(boardArr , callback){
	var sqlQuery = 'SELECT anid from anony_reply WHERE ( anid  = ';
	for (var i = 0 ; i < boardArr.length ; i++){
		sqlQuery = sqlQuery + mysql.escape(boardArr[i].anid) +') OR ( anid = ';
	}
	sqlQuery = sqlQuery.substring(0 , sqlQuery.length-12);
	base.select(sqlQuery , callback);
};

exports.findTagetAnonyByAnid = function (anid , callback){
	var sqlQuery = 'SELECT * FROM anony WHERE anid = ' + mysql.escape(anid);
	base.select(sqlQuery , callback);
}

exports.findAnonyReplyByAnid = function(anid , callback){
	var sqlQuery = 'SELECT * FROM anony_reply WHERE anid = ' + mysql.escape(anid);
	base.select(sqlQuery , callback);
}

exports.foundSearchTotalNum = function(whSearch , search , callback ){
	var sqlQuery = 'SELECT count(*) FROM anony WHERE '
	switch(whSearch) {
		case 0 : sqlQuery = sqlQuery + 'title LIKE "%' + search + '%"';
				 break;
		case 1 : sqlQuery = sqlQuery + 'content LIKE "%' + search + '%"';
		 		 break;
	}
	base.select(sqlQuery , callback);
}

exports.foundSearchBoardPage = function(search , whSearch , pagingNum ,countTop ,callback){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT anid , title , written_time , view_num FROM anony WHERE ';
	
	switch(whSearch) {
	case 0 : sqlQuery = sqlQuery + 'title LIKE "%' + search + '%"';
			 break;
	case 1 : sqlQuery = sqlQuery + 'content LIKE "%' + search + '%"';
	 		 break;
	}
	sqlQuery = sqlQuery + ' ORDER BY anid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
};

exports.register = function(anonyInform , callback){
	var sqlQuery = 'INSERT INTO anony SET ?'
	base.insert(sqlQuery , anonyInform , callback);
}

exports.reviseBoard = function(anonyInfo , callback){
	var sqlQuery = 'UPDATE anony SET title = ' + mysql.escape(anonyInfo.title) + ', content = ' + mysql.escape(anonyInfo.content) + ' WHERE anid = ' + mysql.escape(anonyInfo.anid);
	base.update(sqlQuery , callback);
	
}

exports.deletion = function(anid , callback){
	var sqlQuery = 'DELETE from anony WHERE anid = ' + mysql.escape(anid); 
	base.deletion(sqlQuery , callback);
}

exports.addReply = function(inform , callback){
	var sqlQuery = 'INSERT INTO anony_reply SET ? ';
	base.insert(sqlQuery , inform , callback);
}

exports.deleteReply = function(anrid , callback){
	var sqlQuery = 'DELETE FROM anony_reply WHERE anrid = ' + mysql.escape(anrid);
	base.deletion(sqlQuery , callback);
}

exports.addViewNum = function(anid , callback){
	var sqlQuery = 'UPDATE anony SET view_num = view_num + 1 WHERE anid = ' + mysql.escape(anid);
	base.update(sqlQuery , callback);
}