$('.left_menu_notice').on('click', function(){
	location.replace("/board/notice"); 
});

$('.left_menu_free').on('click', function(){
	location.replace("/board/free"); 
});

$('.left_menu_anony').on('click', function(){
	location.replace("/board/anony"); 
});

$('.left_menu_faq').on('click', function(){
	location.replace("/board/faq"); 
});

$('.left_menu_qna').on('click', function(){
	location.replace("/board/qna"); 
});

$('.anony_make').on('click', function(){
	location.replace("/board/anony/make"); 
});

$('.free_make').on('click', function(){
	location.replace("/board/free/make"); 
});

$('.qna_make').on('click', function(){
	location.replace("/board/qna/make"); 
});

$('.anony_register').on('click', function(){
	
var form = document.createElement("form");
	
	var input = document.createElement("input");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/board/anony/register");
	input.type = "hidden";
	input.name = "title";
	input.value = $('.board_make_name').val();
	form.appendChild(input);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.name = "content";
	input2.value = $('.board_make_text').val();
	form.appendChild(input2);
	document.body.appendChild(form);
	form.submit();
});

$('.free_register').on('click', function(){
	var form = document.createElement("form");
		var input = document.createElement("input");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/board/free/register");
		input.type = "hidden";
		input.name = "title";
		input.value = $('.board_make_name').val();
		form.appendChild(input);
		
		var input2 = document.createElement("input");
		input2.type = "hidden";
		input2.name = "content";
		input2.value = $('.board_make_text').val();
		form.appendChild(input2);
		document.body.appendChild(form);
		form.submit();
	});

$('.qna_register').on('click', function(){
	
	var form = document.createElement("form");
		
		var input = document.createElement("input");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/board/qna/register");
		input.type = "hidden";
		input.name = "title";
		input.value = $('.board_make_name').val();
		form.appendChild(input);
		
		var input2 = document.createElement("input");
		input2.type = "hidden";
		input2.name = "content";
		input2.value = $('.board_make_text').val();
		form.appendChild(input2);
		document.body.appendChild(form);
		form.submit();
	});

function anonyClick(anid){
	location.replace("/board/anony/click?anid="+anid); 
}

function anonyReply(anid){
		var form = document.createElement("form");
		var input = document.createElement("input");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/board/anony/reply");
		input.type = "hidden";
		input.name = "bid";
		input.value = anid;
		form.appendChild(input);
		
		var input2 = document.createElement("input");
		input2.type = "hidden";
		input2.name = "replyContent";
		input2.value = $('.anony_reply').val();
		form.appendChild(input2);
		
		document.body.appendChild(form);
		form.submit();
	}

function qnaReply(qid){
	var form = document.createElement("form");
	var input = document.createElement("input");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/board/qna/reply");
	input.type = "hidden";
	input.name = "bid";
	input.value = qid;
	form.appendChild(input);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.name = "replyContent";
	input2.value = $('.qna_reply').val();
	form.appendChild(input2);
	
	document.body.appendChild(form);
	form.submit();
}

function freeReply(bid){
	var form = document.createElement("form");
	var input = document.createElement("input");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/board/free/reply");
	input.type = "hidden";
	input.name = "bid";
	input.value = bid;
	form.appendChild(input);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.name = "replyContent";
	input2.value = $('.free_reply').val();
	form.appendChild(input2);
	
	document.body.appendChild(form);
	form.submit();
}

function anonyPage(pageNum){
	location.replace("/board/anony?pageNum="+pageNum); 
}

function qnaPage(pageNum){
	location.replace("/board/qna?pageNum="+pageNum); 
}

function qnaClick(qid){
	location.replace("/board/qna/click?qid="+qid); 
}

$('.notice_make').on('click', function(){
	location.replace("/board/notice/make"); 
});


$('.notice_register').on('click', function(){
	
var form = document.createElement("form");
	
	var input = document.createElement("input");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/board/notice/register");
	input.type = "hidden";
	input.name = "title";
	input.value = $('.board_make_name').val();
	form.appendChild(input);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.name = "content";
	input2.value = $('.board_make_text').val();
	form.appendChild(input2);
	document.body.appendChild(form);
	form.submit();
});

function noticePage(pageNum){
	location.replace("/board/notice?pageNum="+pageNum); 
}

function noticeClick(nid){
	location.replace("/board/notice/click?nid="+nid); 
}

function freePage(pageNum){
	location.replace("/board/free?pageNum="+pageNum); 
}

function freeClick(bid){
	location.replace("/board/free/click?bid="+bid); 
}