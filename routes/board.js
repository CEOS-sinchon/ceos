var express = require('express');
var router = express.Router();
var clubMan = require('../helper/config').clubMan; 
var async = require('async');
var boardDAO = require('../model/BoardFreeDAO');
var userDAO = require('../model/UserDAO');
var qnaDAO = require('../model/QnaDAO');
var anonyDAO = require('../model/AnonyDAO');
var noticeDAO = require('../model/NoticeDAO');
var querystring = require('querystring');

//나중에 body에 파라미터 있는지 없는지 확인하는거 달아놓을것 


/*
router.get('/qna/myboard' , function(req ,res){
	var myid = req.session.passport.user.uid; 
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	if(req.body.pageNum==undefined){
		pageNum = 1;
	} else{
		pageNum = req.body.pageNum;
	}
	async.waterfall([function(callback){
		qnaDAO.foundMyQnaNum(myid , callback);
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		qnaDAO.foundBoardPage(pageNum , countTop , callback ,  myid);
	} , function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
		boardInfo = args1,
		qnaDAO.getQnaReplyNum(boardInfo , callback);
		}
	}] , function(err , result){
		if(err){
			res.render('board_qna_my' , {board : undefined , totalNum : 'noBoard', pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				boardInfo[i].writerName = req.session.passport.user.name;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].qid == result[j].qid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_qna_my' , {board : boardInfo , totalNum : totalNum, pageNum : pageNum});
		}
	});
});*/



router.get('/anony', function(req, res ){
	
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	var target;
	if(req.url.length > 6){
		var qObj = querystring.parse(req.url.substring(7));
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
		anonyDAO.foundTotalNum(callback);
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		anonyDAO.foundBoardPage(pageNum , countTop , callback);
	} ,function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
			boardInfo = args1,
			anonyDAO.getAnonyReplyNum(boardInfo , callback);
		}
	}] , function(err , result){
		if(err){
			res.render('board_anony' , {board : undefined , totalNum : 'noBoard'});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].anid == result[j].anid){
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
		res.render('board_anony' , {board : boardInfo , totalNum : totalNum , pageNum : pageNum});
		}
	});
});

router.get('/anony/click' , function(req , res){
	var target;
	if(req.url.length > 12){
		var qObj = querystring.parse(req.url.substring(13));
		console.log(qObj);
		if(qObj.anid == undefined){
			res.redirect('/board/anony');
		} else {
			target = qObj.anid;
		}
	} else{
		res.redirect('/board/anony');
	}
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	var targetBoardReply;
	var targetBoardInfo;
	var bidNum = target; 
	if(req.body.pageNum==undefined){
		pageNum = 1;
	} else{
		pageNum = req.body.pageNum;
	}
	async.waterfall([function(callback){
		if(bidNum == undefined){
			callback('err' , null);
		}else{
			anonyDAO.findTagetAnonyByAnid(bidNum , callback);
		}
	} ,function(args1 , callback){
		targetBoardInfo = args1;
		anonyDAO.findAnonyReplyByAnid(bidNum , callback);
	}, function(args1 ,callback){
		targetBoardReply = args1;
		anonyDAO.addViewNum(bidNum , callback);
	},function(args1 , callback){
		anonyDAO.foundTotalNum(callback);
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		anonyDAO.foundBoardPage(pageNum , countTop , callback);
	} ,function(args1 , callback){
		boardInfo = args1,
		anonyDAO.getAnonyReplyNum(boardInfo , callback);
	}] , function(err , result){
		if(err){
			res.redirect('/board/anony')
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].anid == result[j].anid){
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
		res.render('board_anony_det' , {targetBoardReply : targetBoardReply , targetBoardInfo : targetBoardInfo[0]}); //여기부터 하고가면될듯
		}
	});
});

router.get('/anony/make' , function(req , res){
	res.render('board_anony_make' , {});
});

router.get('/notice/make' , function(req , res){
	if(req.session.passport.user.uid==clubMan){
		res.render('board_notice_make' , {});
	} else{
		res.redirect('/board/notice');
	}
});

router.post('/notice/register' , function(req , res){
	async.waterfall([function(callback){
		var inform = {
				title : req.body.title,
				content : req.body.content,
				writer : req.session.passport.user.uid
		}
		noticeDAO.register(inform , callback);
	}] , function(err , result){
		if(err){
			res.send('작성완료 안됨 내부오류');
		}else{
			res.redirect('/board/notice');
		}
	});
});


router.get('/anony/search', function(req, res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;					//search시에 찾을 문자열 파라미터로 search로 줘야하고 
	var countPage = 5;				//검색종류에서 0은 제목 1은 내용 2는 글쓴이  파라미터 이름은 whatSearch 익게니까 2는뺄것
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
			anonyDAO.foundSearchTotalNum(whSearch , search ,callback);
			 //글쓴사람 검색일때 글쓴사람 uidArr 얻어내는 과정
		}
	}, function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		console.log(totalNum);
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
			anonyDAO.foundSearchBoardPage(search , whSearch , pageNum , countTop , callback, uidArr);
		} , function(args1 , callback){
			if(args1[0] == ''){
				callback('noBoard' , false);
			} else{
				boardInfo = args1,
				anonyDAO.getAnonyReplyNum(boardInfo , callback);
			}
		}] , function(err , result){
		if(err){
			res.render('board_anony_search' , {board : undefined , totalNum : 'noBoard', pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].anid == result[j].anid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_anony' , {board : boardInfo , totalNum : totalNum , search : search , whSearch : whSearch, pageNum : pageNum}); //search랑 whSearch 넘기는 이유는 Paging 버튼 눌러도 클라에서 바로바로 요청할수있게 할라고..
		}
	});
});

router.post('/anony/register' , function(req , res){
	var inform = {
			title : req.body.title,
			content : req.body.content,
			writer : req.session.passport.user.uid
	}
	async.waterfall([function(callback){
		anonyDAO.register(inform , callback);
	}] , function(err , result){
		if(err){
			res.send('작성완료 안됨 내부오류');
		}else{
			res.redirect('/board/anony');
		}
	});
});

router.get('/anony/revise' , function(req , res){
	var inform = {
			title : "아니 슈발",//req.body.title;
			content : "내가 이렇게 공부했으면 전교 1등을 했을텐데", //req.body.content;
			anid : 2 //req.body.bid
	}
	async.waterfall([function(callback){
		anonyDAO.reviseBoard(inform , callback);
	}] , function(err , result){
		if(err){
			res.send('익명글 수정 안됨 내부오류');
		} else{
			res.send('익명글 수정 됨');
		}
	});
});

router.get('/anony/delete' , function(req , res){
	var targetAnid = 2; // req.body.bid;
	async.waterfall([function(callback){
		anonyDAO.deletion(targetAnid , callback);
	}] , function(err ,result){
		if(err){
			res.send('익게 삭제 안됨 내부오류');
		} else{
			res.send('익게글 삭제 됨');
		}
	});
});

router.post('/anony/reply' , function(req , res){
	async.waterfall([function(callback){
		var inform = {
				anid : req.body.bid, //req.body.bid
				writer : req.session.passport.user.uid,
				content : req.body.replyContent //req.body.replyContent
		}
		anonyDAO.addReply(inform  , callback);
	}] , function(err ,result){
		if(err){
			res.send('익게 댓글 내부오류');
		} else{
			res.redirect('/board/anony/click?anid='+req.body.bid);
		}
	});
});

router.get('/anony/deletereply' , function(req , res){
	var anrid =  6;//req.body.rid
	async.waterfall([function(callback){
		anonyDAO.deleteReply(anrid , callback);
	}] , function(err ,result){
		if(err){
			res.send('익게 댓글 삭제 내부오류');
		} else{
			res.send('익게글 댓글 삭제 ');
		}
	});
});


router.get('/faq', function(req, res ){
	res.render('board_faq' , {});
});


router.get('/free', function(req, res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	if(req.url.length > 5){
		var qObj = querystring.parse(req.url.substring(6));
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
		boardDAO.foundTotalNum(callback);
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		boardDAO.foundBoardPage(pageNum , countTop , callback);
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
		boardDAO.getReplyNum(boardInfo , callback);
	}] , function(err , result){
		if(err){
			res.render('board_free' , {board : undefined , totalNum : 'noBoard'});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].bid == result[j].bid){
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
		res.render('board_free' , {board : boardInfo , totalNum : totalNum , pageNum : pageNum});
		}
	});
});

router.get('/free/click' , function(req,res){ // 보드에서 클릭했을때 함수
	var target;
	if(req.url.length > 11){
		var qObj = querystring.parse(req.url.substring(12));
		console.log(qObj);
		if(qObj.bid == undefined){
			res.redirect('/board/free');
		} else {
			target = qObj.bid;
		}
	} else{
		res.redirect('/board/free');
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
			boardDAO.findTagetBoardByBid(bidNum , callback);
		}
	} ,function(args1 , callback){
		targetBoardInfo = args1;
		boardDAO.findBoardReplyByBid(bidNum , callback);
	}, function(args1 , callback){
		targetBoardReply = args1;
		boardDAO.addViewNum(bidNum , callback);
	}, function(args1 ,callback){
		if(targetBoardReply.length == 0){
			callback(null , null);
		} else{
			boardDAO.findReplyWriter(targetBoardReply , callback);
		}
	} ,function(args1 , callback){
		for(var i = 0 ; i <targetBoardReply.length ; i++){
			targetBoardReply[i].writerName = "";
			for(var j = 0 ; j <args1.length ; j++){
				if(targetBoardReply[i].writer ==args1[j].uid){
					targetBoardReply[i].writerName = args1[j].name;
				}
			}
		}
		boardDAO.foundTotalNum(callback);
	}, function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		boardDAO.foundBoardPage(pageNum , countTop , callback);
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
		boardDAO.getReplyNum(boardInfo , callback);
	}] , function(err , result){
		if(err){
			res.render('board_free_det' , {board : undefined , totalNum : 'noBoard'});
		} else{
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
			//각 게시물에서 리플갯수 더하는거
		res.render('board_free_det' , { targetBoardReply : targetBoardReply , targetBoardInfo : targetBoardInfo[0]}); //여기부터 하고가면될듯
		}
	});
});



router.get('/free/search', function(req, res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;					//search시에 찾을 문자열 파라미터로 search로 줘야하고 
	var countPage = 5;				//검색종류에서 0은 제목 1은 내용 2는 글쓴이  파라미터 이름은 whatSearch
	var boardInfo;
	var search = '귀';//req.body.search;
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
						boardDAO.foundBoardTotalNumByUidArr(uidArr , subCallback);
					}
				}] , function(err ,subResult){
					if(err){
						callback('noBoard' , false);
					} else{
						callback(null , subResult);
					}
				});
			}else{
				boardDAO.foundSearchTotalNum(whSearch , search ,callback);
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
			boardDAO.foundSearchBoardPage(search , whSearch , pageNum , countTop , callback, uidArr);
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
			boardDAO.getReplyNum(boardInfo , callback);
		}] , function(err , result){
		if(err){
			res.render('board_free_search' , {board : undefined , totalNum : 'noBoard', pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].bid == result[j].bid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_free_search' , {board : boardInfo , totalNum : totalNum , search : search , whSearch : whSearch, pageNum : pageNum}); //search랑 whSearch 넘기는 이유는 Paging 버튼 눌러도 클라에서 바로바로 요청할수있게 할라고..
		}
	});
});

router.get('/free/myboard' , function(req , res){
	var myid = req.session.passport.user.uid; 
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	if(req.body.pageNum==undefined){
		pageNum = 1;
	} else{
		pageNum = req.body.pageNum;
	}
	async.waterfall([function(callback){
		boardDAO.foundMyBoardNum(myid , callback);
	} , function(args1, callback){
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1[0]['count(*)'];
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		boardDAO.foundBoardPage(pageNum , countTop , callback ,  myid);
	} , function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
		boardInfo = args1,
		boardDAO.getReplyNum(boardInfo , callback);
		}
	}] , function(err , result){
		if(err){
			res.render('board_free_my' , {board : undefined , totalNum : 'noBoard', pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				boardInfo[i].writerName = req.session.passport.user.name;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].bid == result[j].bid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_free_my' , {board : boardInfo , totalNum : totalNum, pageNum : pageNum});
		}
	});
});

router.get('/free/myboard/search', function(req, res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;					//search시에 찾을 문자열 파라미터로 search로 줘야하고 
	var countPage = 5;				//검색종류에서 0은 제목 1은 내용 여기는 내글안에서 검색이니까 글쓴이 검색 뺄것
	var boardInfo;
	var search = '귀';//req.body.search;
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
			boardDAO.foundSearchTotalNum(whSearch , search ,callback , req.session.passport.user.uid);
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
			boardDAO.foundSearchBoardPage(search , whSearch , pageNum , countTop , callback, uidArr , req.session.passport.user.uid);
		} , function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
		boardInfo = args1,
		boardDAO.getReplyNum(boardInfo , callback);
		}
	}] , function(err , result){
		if(err){
			res.render('board_free_search' , {board : undefined , totalNum : 'noBoard', pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				boardInfo[i].writerName = req.session.passport.user.name;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].bid == result[j].bid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_free_search' , {board : boardInfo , totalNum : totalNum , search : search , whSearch : whSearch, pageNum : pageNum}); //search랑 whSearch 넘기는 이유는 Paging 버튼 눌러도 클라에서 바로바로 요청할수있게 할라고..
		}
	});
});

router.get('/free/myreply' , function(req , res){
	var myid = req.session.passport.user.uid; 
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;
	var countPage = 5;
	var boardInfo;
	if(req.body.pageNum==undefined){
		pageNum = 1;
	} else{
		pageNum = req.body.pageNum;
	}
	async.waterfall([function(callback){
		boardDAO.foundMyReplyBoard(myid , callback);
	} , function(args1, callback){
		if(args1.length == 0){
			callback('noBoard' , false);
		} else{
		var countTop;        //맨마지막장일때 보여줄 갯수 제한
		totalNum = args1.length;
		if(pageNum * countPage > totalNum){
			countTop =  totalNum - (pageNum - 1) * countPage;
		} else{
			countTop = countPage;
		}//맨 마지막장일때와 아닐때 처리
		boardDAO.foundBoardBybid(callback , pageNum , countTop , args1);
		}
	} , function(args1 , callback){
		boardInfo = args1,
		boardDAO.getReplyNum(boardInfo , callback);
	}] , function(err , result){
		if(err){
			totalNum = 0;
			res.render('board_free_reply' , {board : undefined ,totalNum : totalNum , pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].bid == result[j].bid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_free_reply' , {board : boardInfo , totalNum : totalNum, pageNum : pageNum});
		}
	});
});

/*
router.get('/free/myreply/search', function(req, res){
	var pageNum;					//보드 페이지번호 파라미터로 넘겨줘야함 없을시 첫번째 페이지 보이게 무조건 해놓음 파라미터 이름은 pageNum
	var totalNum;					//search시에 찾을 문자열 파라미터로 search로 줘야하고 
	var countPage = 5;				//검색종류에서 0은 제목 1은 내용 2는 글쓴이  파라미터 이름은 whatSearch
	var boardInfo;
	var search = '귀';//req.body.search;
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
						boardDAO.foundBoardTotalNumByUidArr(uidArr , subCallback);
					}
				}] , function(err ,subResult){
					if(err){
						callback('noBoard' , false);
					} else{
						callback(null , subResult);
					}
				});
			}else{
				boardDAO.foundSearchTotalNum(whSearch , search ,callback);
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
			boardDAO.foundSearchBoardPage(search , whSearch , pageNum , countTop , callback, uidArr);
		} , function(args1 , callback){
		if(args1[0] == ''){
			callback('noBoard' , false);
		} else{
		boardInfo = args1,
		boardDAO.getReplyNum(boardInfo , callback);
		}
	}] , function(err , result){
		if(err){
			res.render('board_reply_search' , {board : undefined , totalNum : 'noBoard', pageNum : pageNum});
		} else{
			for(var i = 0 ; i < boardInfo.length ; i++){
				boardInfo[i].reply_num = 0;
				for(var j = 0; j < result.length ; j++){
					if(boardInfo[i].bid == result[j].bid){
						++boardInfo[i].reply_num;
					}
				}
			}//각 게시물에서 리플갯수 더하는거
		res.render('board_reply_search' , {board : boardInfo , totalNum : totalNum , search : search , whSearch : whSearch, pageNum : pageNum}); //search랑 whSearch 넘기는 이유는 Paging 버튼 눌러도 클라에서 바로바로 요청할수있게 할라고..
		}
	});
});*/

//위에껀 하자고하면 고치자 슈발

router.post('/free/register', function(req , res){
	async.waterfall([function(callback){
		var inform = {
				title : req.body.title,//req.body.title;
				content : req.body.content, //req.body.content;
				writer : req.session.passport.user.uid
		}
		boardDAO.register(inform , callback);
	}] , function(err , result){
		if(err){
			res.send('자게 작성완료 안됨 내부오류');
		}else{
			res.redirect('/board/free');
		}
	});
});

router.get('/free/make', function(req , res){
	res.render('board_free_make' , {});
});

router.get('/free/revise' , function(req , res){
	var inform = {
			title : "아니 슈발",//req.body.title;
			content : "내가 이렇게 공부했으면 전교 1등을 했을텐데", //req.body.content;
			bid : 2 //req.body.bid
	}
	async.waterfall([function(callback){
		boardDAO.reviseBoard(inform , callback);
	}] , function(err , result){
		if(err){
			res.send('board 수정 안됨 내부오류');
		} else{
			res.send('자게글 수정 됨');
		}
	});
});

router.get('/free/delete' , function(req , res){
	var targetBid = 2; // req.body.bid;
	async.waterfall([function(callback){
		boardDAO.deletion(targetBid , callback);
	}] , function(err ,result){
		if(err){
			res.send('board 삭제 안됨 내부오류');
		} else{
			res.send('자게글 삭제 됨');
		}
	});
});

router.post('/free/reply' , function(req , res){
	async.waterfall([function(callback){
		var inform = {
				bid : req.body.bid, //req.body.bid
				writer : req.session.passport.user.uid, //req.body.replyWriter
				content : req.body.replyContent //req.body.replyContent
		}
		boardDAO.addReply(inform  , callback);
	}] , function(err ,result){
		if(err){
			res.send('자게 댓글 내부오류');
		} else{
			res.redirect('/board/free/click?bid='+req.body.bid);
		}
	});
});

router.get('/free/deletereply' , function(req , res){
	var rid =  6;//req.body.rid
	async.waterfall([function(callback){
		boardDAO.deleteReply(rid , callback);
	}] , function(err ,result){
		if(err){
			res.send('자게 댓글 삭제 내부오류');
		} else{
			res.send('자게글 댓글 삭제 ');
		}
	});
});


module.exports = router;
