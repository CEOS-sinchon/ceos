var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.foundTotalNum = function(callback){
	var sqlQuery = 'SELECT count(*) from qna';
	base.select(sqlQuery , callback);
};

exports.foundBoardPage = function(pagingNum ,countTop ,callback , uid){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT qid , title , content ,writer , written_time , view_num FROM qna ';
		if(uid !== undefined){
			sqlQuery = sqlQuery + ' WHERE writer = ' +mysql.escape(uid);
		}
		sqlQuery = sqlQuery + ' ORDER BY qid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
};


exports.getQnaReplyNum = function(boardArr , callback){
	var sqlQuery = 'SELECT qid from qna_reply WHERE ( qid  = ';
	for (var i = 0 ; i < boardArr.length ; i++){
		sqlQuery = sqlQuery + mysql.escape(boardArr[i].qid) +') OR ( qid = ';
	}
	sqlQuery = sqlQuery.substring(0 , sqlQuery.length-12);
	base.select(sqlQuery , callback);
};

exports.findTagetBoardByQid = function (qid , callback){
	var sqlQuery = 'SELECT * FROM qna WHERE qid = ' + mysql.escape(qid);
	base.select(sqlQuery , callback);
}

exports.findQnaReplyByQid = function(qid , callback){
	var sqlQuery = 'SELECT * FROM qna_reply WHERE qid = ' + mysql.escape(qid);
	base.select(sqlQuery , callback);
}

exports.findReplyWriter = function(replyArr , callback){
	var sqlQuery = 'SELECT uid , name FROM user WHERE ';
	for(var i = 0 ; i < replyArr.length ; i++){
		sqlQuery = sqlQuery + ' ( uid = ' + mysql.escape(replyArr[i].writer) + ' ) OR';
	}
	sqlQuery = sqlQuery.substring(0 , sqlQuery.length - 3);
	base.select(sqlQuery , callback);
}

exports.foundBoardTotalNumByUidArr = function(uidArr , callback ){
	var sqlQuery = 'SELECT count(*) FROM qna WHERE ';
	for(var i = 0 ; i < uidArr.length ; i++){
		sqlQuery = sqlQuery + '(writer = ' + mysql.escape(uidArr[i].uid) +') OR '
	}
	sqlQuery = sqlQuery.substring(0 , sqlQuery.length - 4);
	base.select(sqlQuery , callback);
};

exports.foundSearchBoardPage = function(search , whSearch , pagingNum ,countTop ,callback , uidArr , myUid){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT qid , title , writer , written_time , view_num FROM qna WHERE ';
	
	switch(whSearch) {
	case 0 : sqlQuery = sqlQuery + 'title LIKE "%' + search + '%"';
			 break;
	case 1 : sqlQuery = sqlQuery + 'content LIKE "%' + search + '%"';
	 		 break;
	case 2 : {
			for(var i = 0 ; i < uidArr.length ; i++){
				sqlQuery = sqlQuery + ' (writer = ' + uidArr[i].uid +' ) OR '
				}
			sqlQuery = sqlQuery.substring(0 ,sqlQuery.length - 4);
			}
	}
	if(myUid!==undefined){
		' AND writer = ' + mysql.escape(myUid);
	}
	sqlQuery = sqlQuery + ' ORDER BY qid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
};

exports.foundSearchTotalNum = function(whSearch , search , callback , myUid){
	var sqlQuery = 'SELECT count(*) FROM qna WHERE '
		switch(whSearch) {
			case 0 : sqlQuery = sqlQuery + 'title LIKE "%' + search + '%"';
					 break;
			case 1 : sqlQuery = sqlQuery + 'content LIKE "%' + search + '%"';
			 		 break;
		}
		if(myUid!==undefined){
			sqlQuery = sqlQuery + " AND writer = " + mysql.escape(myUid);
		}
		base.select(sqlQuery , callback);
};

exports.foundMyQnaNum = function(uid , callback){
	var sqlQuery = 'SELECT count(*) from qna WHERE writer = ' + mysql.escape(uid);
	base.select(sqlQuery , callback);
};

exports.register = function(qnaInform , callback){
	var sqlQuery = 'INSERT INTO qna SET ?'
		base.insert(sqlQuery , qnaInform , callback);
}

exports.reviseBoard = function(qnaInfo , callback){
	var sqlQuery = 'UPDATE qna SET title = ' + mysql.escape(qnaInfo.title) + ', content = ' + mysql.escape(qnaInfo.content) + ' WHERE qid = ' + mysql.escape(qnaInfo.anid);
	base.update(sqlQuery , callback);
	
}

exports.deletion = function(qid , callback){
	var sqlQuery = 'DELETE from qna WHERE qid = ' + mysql.escape(qid); 
	base.deletion(sqlQuery , callback);
}

exports.addReply = function(inform , callback){
	var sqlQuery = 'INSERT INTO qna_reply SET ? ';
	base.insert(sqlQuery , inform , callback);
}

exports.deleteReply = function(qrid , callback){
	var sqlQuery = 'DELETE FROM qna_reply WHERE qrid = ' + mysql.escape(qrid);
	base.deletion(sqlQuery , callback);
}

exports.addViewNum = function(qid , callback){
	var sqlQuery = 'UPDATE qna SET view_num = view_num + 1 WHERE qid = ' + mysql.escape(qid);
	base.update(sqlQuery , callback);
}