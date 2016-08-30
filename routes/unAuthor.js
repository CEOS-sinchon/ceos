var express = require('express');
var router = express.Router();
var async = require('async');
var boardDAO = require('../model/BoardFreeDAO');
var userDAO = require('../model/UserDAO');
var qnaDAO = require('../model/QnaDAO');
var anonyDAO = require('../model/AnonyDAO');
var noticeDAO = require('../model/NoticeDAO');
var querystring = require('querystring');


router.get('/qna', function(req, res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	if(req.url.length > 4){
		var qObj = querystring.parse(req.url.substring(5));
		console.log(qObj);
		if(qObj.pageNum == undefined){
			target=1;
		} else {
			target = qObj.pageNum;
		}
	} else{
		target=1;
	}
	pageNum = target;
	async.waterfall([function(callback){
		qnaDAO.foundTotalNum(callback);
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		qnaDAO.foundBoardPage(pageNum , countTop , callback);
	} ,function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
			boardInfo = args1,
			userDAO.findWriter(boardInfo , callback);
		}
	} ,function(args1 , callback){
		for(var i = 0 ; i < boardInfo.length ; i++){
			if(boardInfo[i].writer == 0){
				boardInfo[i].writerName = "손님";
			}
			for(var j = 0 ; j <args1.length ; j++){
				if(boardInfo[i].writer == args1[j].uid){
					boardInfo[i].writerName = args1[j].name;
					break;
				}
			}
		}
		qnaDAO.getQnaReplyNum(boardInfo , callback);
	}] , function(err , result){
		if(err){
			res.render('board_qna' , {board : undefined , totalNum : 'noBoard'});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].qid == result[j].qid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
			for(var i = 0 ; i < boardInfo.length ; i++){
				var d = new Date(boardInfo[i].written_time);
				var temp;
				if(d.getMonth()<9){
					temp = "0"+(d.getMonth()+1);
				} else {
					temp = "" + (d.getMonth()+1);
				}
				boardInfo[i].written_time = d.getFullYear()+"-"+temp+"-"+d.getDate();
			}
		res.render('board_qna' , {board : boardInfo , totalNum : totalNum , pageNum : pageNum});
		}
	});
});

router.get('/qna/click' , function(req , res){ // qna 클릭했을때
	var target;
	if(req.url.length > 10){
		var qObj = querystring.parse(req.url.substring(11));
		console.log(qObj);
		if(qObj.qid == undefined){
			res.redirect('/board/qna');
		} else {
			target = qObj.qid;
		}
	} else{
		res.redirect('/board/qna');
	}
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	var targetBoardReply;
	var targetBoardInfo;
	var bidNum = target; //req.body.bidNum;
	if(req.body.pageNum==undefined){
		pageNum = 1;
	} else{
		pageNum = req.body.pageNum;
	}
	async.waterfall([function(callback){
		if(bidNum == undefined){
			callback('err' , null);
		}else{
			qnaDAO.findTagetBoardByQid(bidNum , callback);
		}
	} ,function(args1 , callback){
		targetBoardInfo = args1;
		qnaDAO.findQnaReplyByQid(bidNum , callback);
	}, function(args1 ,callback){
		targetBoardReply = args1;
		qnaDAO.addViewNum(bidNum , callback);
	}, function(args1 ,callback){
		if(targetBoardReply.length == 0){
			callback(null , null);
		} else{
			qnaDAO.findReplyWriter(targetBoardReply , callback);
		}
	} ,function(args1 , callback){
		for(var i = 0 ; i <targetBoardReply.length ; i++){
			targetBoardReply[i].writerName = "손님";
			for(var j = 0 ; j <args1.length ; j++){
				if(targetBoardReply[i].writer ==args1[j].uid){
					targetBoardReply[i].writerName = args1[j].name;
				}
			}
		}
		qnaDAO.foundTotalNum(callback);
	}, function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		qnaDAO.foundBoardPage(pageNum , countTop , callback);
	} ,function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
			boardInfo = args1,
			userDAO.findWriter(boardInfo , callback);
		}
	} ,function(args1 , callback){
		for(var i = 0 ; i < boardInfo.length ; i++){
			for(var j = 0 ; j <args1.length ; j++){
				if(boardInfo[i].writer == args1[j].uid){
					boardInfo[i].writerName = args1[j].name;
					break;
				}
			}
		}
		for(var i = 0 ; i <args1.length ; i++){
			if(targetBoardInfo[0].writer == args1[i].uid){
				targetBoardInfo[0].writerName=args1[i].name;
			}
		}
		if(targetBoardInfo[0].writer == 0){
			targetBoardInfo[0].writerName="손님";
		}
		qnaDAO.getQnaReplyNum(boardInfo , callback);
	}] , function(err , result){
		if(err){
			res.render('board_qna_det' , {board : undefined , totalNum : 'noBoard'});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].qid == result[j].qid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
			for(var i = 0 ; i < targetBoardReply.length ; i++){
				var d = new Date(targetBoardReply[i].written_time);
				var temp;
				if(d.getMonth()<9){
					temp = "0"+(d.getMonth()+1);
				} else {
					temp = "" + (d.getMonth()+1);
				}
				targetBoardReply[i].written_time = d.getFullYear()+"-"+temp+"-"+d.getDate();
			}
			
			var d = new Date(targetBoardInfo[0].written_time);
			var temp;
			if(d.getMonth()<9){
				temp = "0"+(d.getMonth()+1);
			} else {
				temp = "" + (d.getMonth()+1);
			}
			targetBoardInfo[0].written_time = d.getFullYear()+"-"+temp+"-"+d.getDate();
			console.log(targetBoardReply);
			console.log(targetBoardInfo[0]);
		res.render('board_qna_det' , {targetBoardReply : targetBoardReply , targetBoardInfo : targetBoardInfo[0]}); //여기부터 하고가면될듯
		}
	});
});

router.get('/qna/search' , function(req , res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;					//search시에 찾을 문자열 파라미터로 search로 줘야하고 
	var countPage = 5;				//검색종류에서 0은 제목 1은 내용 2는 글쓴이  파라미터 이름은 whatSearch
	var boardInfo;
	var search = '아';//req.body.search;
	var whSearch = 1;//req.body.whatSearch;
	var uidArr;
	if(req.body.pageNum==undefined){
		pageNum = 1;
	} else{
		pageNum = req.body.pageNum;
	}
	async.waterfall([function(callback){
		if(search == undefined || whSearch == undefined){
			callback('noBoard' , false); //그냥 경로로 들어왔을때 처리 사실 검색 쿼리로 하면될것같은데 너가 전화안받으니 일단 이렇게 해놓음 아니면 아싸리 포스트로 해버릴까 모르겠다 나중에 얘기 ㄱㄱ
		}else{
			if(whSearch == 2){
				async.waterfall([function(subCallback){
					userDAO.findUserByName(search , subCallback);
				}, function(args1 , subCallback){
					if(args1.length==0){
						subCallback('noBoard' , false);
					} else{
						uidArr = args1;
						qnaDAO.foundBoardTotalNumByUidArr(uidArr , subCallback);
					}
				}] , function(err ,subResult){
					if(err){
						callback('noBoard' , false);
					} else{
						callback(null , subResult);
					}
				});
			}else{
				qnaDAO.foundSearchTotalNum(whSearch , search ,callback);
			} //글쓴사람 검색일때 글쓴사람 uidArr 얻어내는 과정
		}
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		console.log(totalNum);
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
			qnaDAO.foundSearchBoardPage(search , whSearch , pageNum , countTop , callback, uidArr);
		} , function(args1 , callback){
			if(args1[0] == ''){
				callback('noBoard' , false);
			} else{
				boardInfo = args1,
				userDAO.findWriter(boardInfo , callback);
			}
		} ,function(args1 , callback){
			for(var i = 0 ; i < boardInfo.length ; i++){
				for(var j = 0 ; j <args1.length ; j++){
					if(boardInfo[i].writer == args1[j].uid){
						boardInfo[i].writerName = args1[j].name;
						break;
					}
				}
			}
			qnaDAO.getQnaReplyNum(boardInfo , callback);
		}] , function(err , result){
		if(err){
			res.render('board_qna_search' , {board : undefined , totalNum : 'noBoard', pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].qid == result[j].qid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_qna_search' , {board : boardInfo , totalNum : totalNum , search : search , whSearch : whSearch, pageNum : pageNum}); //search랑 whSearch 넘기는 이유는 Paging 버튼 눌러도 클라에서 바로바로 요청할수있게 할라고..
		}
	});
});

router.get('/qna/make', function(req , res){
	res.render('board_qna_make' , {});
});

router.post('/qna/register' , function(req , res){
	async.waterfall([function(callback){
		var temp = 0;
		if(req.session.passport !== undefined){
			temp = req.session.passport.user.uid;
		}
		var inform = {
				title : req.body.title,//req.body.title;
				content : req.body.content, //req.body.content;
				writer : temp
		}
		qnaDAO.register(inform , callback);
	}] , function(err , result){
		if(err){
			res.send('qna 작성완료 안됨 내부오류');
		}else{
			res.redirect('/board/qna');
		}
	});
});

router.get('/qna/revise' , function(req , res){
	var inform = {
			title : "아니 슈발",//req.body.title;
			content : "내가 이렇게 공부했으면 전교 1등을 했을텐데", //req.body.content;
			qid : 2 //req.body.bid
	}
	async.waterfall([function(callback){
		qnaDAO.reviseBoard(inform , callback);
	}] , function(err , result){
		if(err){
			res.send('qna 수정 안됨 내부오류');
		} else{
			res.send('qna글 수정 됨');
		}
	});
});

router.get('/qna/delete' , function(req , res){
	var targetQid = 2; // req.body.bid;
	async.waterfall([function(callback){
		qnaDAO.deletion(targetQid , callback);
	}] , function(err ,result){
		if(err){
			res.send('qna 삭제 안됨 내부오류');
		} else{
			res.send('qna 글 삭제 됨');
		}
	});
});

router.post('/qna/reply' , function(req , res){
	async.waterfall([function(callback){
		var temp = 0;
		if(req.session.passport !== undefined){
			temp = req.session.passport.user.uid;
		}
		var inform = {
				qid : req.body.bid, //req.body.bid
				writer : temp, //req.body.replyWriter
				content : req.body.replyContent //req.body.replyContent
		}
		qnaDAO.addReply(inform  , callback);
	}] , function(err ,result){
		if(err){
			res.send('qna 댓글 내부오류');
		} else{
			res.redirect('/board/qna/click?qid='+req.body.bid);
		}
	});
});

router.get('/qna/deletereply' , function(req , res){
	var qrid =  6;//req.body.rid
	async.waterfall([function(callback){
		qnaDAO.deleteReply(qrid , callback);
	}] , function(err ,result){
		if(err){
			res.send('qna 댓글 삭제 내부오류');
		} else{
			res.send('qna글 댓글 삭제 ');
		}
	});
});


router.get('/notice' , function(req, res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	if(req.url.length > 7){
		var qObj = querystring.parse(req.url.substring(8));
		console.log(qObj);
		if(qObj.pageNum == undefined){
			target=1;
		} else {
			target = qObj.pageNum;
		}
	} else{
		target=1;
	}
	pageNum = target;
	async.waterfall([function(callback){
		noticeDAO.foundTotalNum(callback);
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		noticeDAO.foundBoardPage(pageNum , countTop , callback);
	} ,function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
			boardInfo = args1,
			userDAO.findWriter(boardInfo , callback);
		}
	} ,function(args1 , callback){
		for(var i = 0 ; i < boardInfo.length ; i++){
			for(var j = 0 ; j <args1.length ; j++){
				if(boardInfo[i].writer == args1[j].uid){
					boardInfo[i].writerName = args1[j].name;
					break;
				}
			}
		}
		callback(null,true);
	}] , function(err , result){
		if(err){
			res.render('board_notice' , {board : undefined , totalNum : 'noBoard'});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				var d = new Date(boardInfo[i].written_time);
				var temp;
				if(d.getMonth()<9){
					temp = "0"+(d.getMonth()+1);
				} else {
					temp = "" + (d.getMonth()+1);
				}
				boardInfo[i].written_time = d.getFullYear()+"-"+temp+"-"+d.getDate();
			}
		res.render('board_notice' , {board : boardInfo , totalNum : totalNum , pageNum : pageNum});
		}
	});
});

router.get('/notice/click' , function(req,res){ // 보드에서 클릭했을때 함수
	var target;
	if(req.url.length > 13){
		var qObj = querystring.parse(req.url.substring(14));
		console.log(qObj);
		if(qObj.nid == undefined){
			res.redirect('/board/notice');
		} else {
			target = qObj.nid;
		}
	} else{
		res.redirect('/board/notice');
	}
	
	var pageNum;					
	var totalNum;
	var countPage = 5;
	var boardInfo;
	var targetBoardReply;
	var targetBoardInfo;
	var bidNum = target; //req.body.bidNum;
	if(req.body.pageNum==undefined){
		pageNum = 1;
	} else{
		pageNum = req.body.pageNum;
	}
	async.waterfall([function(callback){
		if(bidNum == undefined){
			callback('err' , null);
		}else{
			noticeDAO.findTagetBoardByBid(bidNum , callback);
		}
	} ,function(args1 , callback){
		targetBoardInfo = args1;
		callback(null , true);
	}, function(args1 ,callback){
		noticeDAO.addViewNum(bidNum , callback);
	} ,function(args1 , callback){
		noticeDAO.foundTotalNum(callback);
	}, function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		noticeDAO.foundBoardPage(pageNum , countTop , callback);
	} ,function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
			boardInfo = args1,
			userDAO.findWriter(boardInfo , callback);
		}
	} ,function(args1 , callback){
		for(var i = 0 ; i < boardInfo.length ; i++){
			for(var j = 0 ; j <args1.length ; j++){
				if(boardInfo[i].writer == args1[j].uid){
					boardInfo[i].writerName = args1[j].name;
					break;
				}
			}
		}
		for(var i = 0 ; i <args1.length ; i++){
			if(targetBoardInfo[0].writer == args1[i].uid){
				targetBoardInfo[0].writerName=args1[i].name;
			}
		}
		callback(null , true);
	}] , function(err , result){
		if(err){
			res.redirect('/board/notice');
		} else{
			var d = new Date(targetBoardInfo[0].written_time);
			var temp;
			if(d.getMonth()<9){
				temp = "0"+(d.getMonth()+1);
			} else {
				temp = "" + (d.getMonth()+1);
			}
			targetBoardInfo[0].written_time = d.getFullYear()+"-"+temp+"-"+d.getDate();
			console.log(targetBoardInfo[0]);
			res.render('board_notice_det' , { targetBoardInfo : targetBoardInfo[0]}); //여기부터 하고가면될듯
		}
	});
});

router.get('/faq' , function(req , res){
	res.render('board_faq' , {});
});


module.exports = router;