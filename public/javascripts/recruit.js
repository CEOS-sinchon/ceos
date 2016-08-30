$('.left_menu_recruit').on('click', function(){
	location.replace("/recruit");    
});

$('.left_menu_apply').on('click', function(){
	location.replace("/recruit/apply");    
});


$('.left_menu_faq').on('click', function(){
	location.replace("/recruit/faq");    
});

$('.left_menu_qna').on('click', function(){
	location.replace("/recruit/qna");    
});

$('.qna_make').on('click', function(){
	location.replace("/recruit/qna/make"); 
});

$('.qna_register').on('click', function(){
	var form = document.createElement("form");
		
		var input = document.createElement("input");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/recruit/qna/register");
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

function qnaClick(qid){
	location.replace("/recruit/qna/click?qid="+qid); 
}

function qnaReply(qid){
	var form = document.createElement("form");
	var input = document.createElement("input");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/recruit/qna/reply");
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
