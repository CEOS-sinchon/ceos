var base = require('./BaseDAO.js');
var mysql = require('mysql');


exports.foundBoardPage = function(pagingNum ,countTop ,callback , uid){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT bid , title , writer, content , written_time , view_num FROM board ';
		if(uid !== undefined){
			sqlQuery = sqlQuery + ' WHERE writer = ' +mysql.escape(uid);
		}
		sqlQuery = sqlQuery + ' ORDER BY bid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
};

exports.foundTotalNum = function(callback){
	var sqlQuery = 'SELECT count(*) from board';
	base.select(sqlQuery , callback);
};

exports.getReplyNum = function(boardArr , callback){
	var sqlQuery = 'SELECT bid from reply WHERE ( bid  = ';
	for (var i = 0 ; i < boardArr.length ; i++){
		sqlQuery = sqlQuery + mysql.escape(boardArr[i].bid) +') OR ( bid = ';
	}
	sqlQuery = sqlQuery.substring(0 , sqlQuery.length-12);
	base.select(sqlQuery , callback);
};

exports.foundMyBoardNum = function(uid , callback){
	var sqlQuery = 'SELECT count(*) from board WHERE writer = ' + mysql.escape(uid);
	base.select(sqlQuery , callback);
};

exports.foundMyReplyBoard = function(uid , callback){
	var sqlQuery = 'SELECT distinct(bid) from reply WHERE writer = ' + mysql.escape(uid);
	base.select(sqlQuery , callback);
};

exports.foundBoardBybid = function(callback , pagingNum ,countTop , bidArr){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT bid , title , writer , written_time , view_num FROM board WHERE ';
		for(var i = 0 ; i < bidArr.length ; i++){
			sqlQuery = sqlQuery + ' (bid = ' + mysql.escape(bidArr[i].bid) + ') OR ';
		}
		sqlQuery = sqlQuery.substring(0 , sqlQuery.length-4);
		sqlQuery = sqlQuery + ' ORDER BY bid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
}

exports.foundSearchTotalNum = function(whSearch , search , callback , myUid){
	var sqlQuery = 'SELECT count(*) FROM board WHERE '
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
}

exports.foundSearchBoardPage = function(search , whSearch , pagingNum ,countTop ,callback , uidArr , myUid){
	var start = (pagingNum - 1) * 5;
	var sqlQuery = 'SELECT bid , title , writer , written_time , view_num FROM board WHERE ';
	
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
	sqlQuery = sqlQuery + ' ORDER BY bid DESC LIMIT ' + start + ' , ' + countTop;
	base.select(sqlQuery , callback);
};

exports.foundBoardTotalNumByUidArr = function(uidArr , callback ){
	var sqlQuery = 'SELECT count(*) FROM board WHERE ';
	for(var i = 0 ; i < uidArr.length ; i++){
		sqlQuery = sqlQuery + '(writer = ' + mysql.escape(uidArr[i].uid) +') OR '
	}
	sqlQuery = sqlQuery.substring(0 , sqlQuery.length - 4);
	base.select(sqlQuery , callback);
};

exports.register = function(boardInform , callback){
	var sqlQuery = 'INSERT INTO board SET ?'
	base.insert(sqlQuery , boardInform , callback);
}

exports.findTagetBoardByBid= function (bid , callback){
	var sqlQuery = 'SELECT * FROM board WHERE bid = ' + mysql.escape(bid);
	base.select(sqlQuery , callback);
}

exports.findBoardReplyByBid = function(bid , callback){
	var sqlQuery = 'SELECT * FROM reply WHERE bid = ' + mysql.escape(bid);
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

exports.reviseBoard = function(boardInfo , callback){
	var sqlQuery = 'UPDATE board SET title = ' + mysql.escape(boardInfo.title) + ', content = ' + mysql.escape(boardInfo.content) + ' WHERE bid = ' + mysql.escape(boardInfo.bid);
	base.update(sqlQuery , callback);
	
}

exports.deletion = function(bid , callback){
	var sqlQuery = 'DELETE from board WHERE bid = ' + mysql.escape(bid); 
	base.deletion(sqlQuery , callback);
}

exports.addReply = function(inform , callback){
	var sqlQuery = 'INSERT INTO reply SET ? ';
	base.insert(sqlQuery , inform , callback);
}

exports.deleteReply = function(rid , callback){
	var sqlQuery = 'DELETE FROM reply WHERE rid = ' + mysql.escape(rid);
	base.deletion(sqlQuery , callback);
}

exports.addViewNum = function(bid , callback){
	var sqlQuery = 'UPDATE board SET view_num = view_num + 1 WHERE bid = ' + mysql.escape(bid);
	base.update(sqlQuery , callback);
}