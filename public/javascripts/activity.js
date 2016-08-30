function act_data_btn(elem){
	if($(elem).hasClass("act_data_show_btn")){
		$(elem).parents(".act_data_box").find(".item_hide").toggleClass("item_hide item_show");

		$(elem).toggleClass ("act_data_show_btn act_data_hide_btn");
		$(elem).find('img').attr("src", "/images/activity_up_btn.png");
	}else{
		console.log($(elem).parents(".act_data_box").find(".item_show"));
		$(elem).parents(".act_data_box").find(".item_show").toggleClass("item_show item_hide");
		$(elem).toggleClass("act_data_hide_btn act_data_show_btn");
		$(elem).find('img').attr("src", "/images/activity_down_btn.png");
	}
}

$(".btn_all").on("click", function(){
	$(".on_page").removeClass("on_page");
	$(this).addClass("on_page");
	$(".right_bot_line").show();
	$(".data_session").hide();
	$(".data_entertain").hide();
	$(".data_networking").hide();
	$(".data_others").hide();
	$(".data_all").show();
});
$(".btn_session").on("click", function(){
	$(".on_page").removeClass("on_page");
	$(this).addClass("on_page");
	$(".right_bot_line").hide();
	$(".session").show();
	$(".data_session").show();
});
$(".btn_entertain").on("click", function(){
	$(".on_page").removeClass("on_page");
	$(this).addClass("on_page");
	$(".right_bot_line").hide();
	$(".entertain").show();
	$(".data_entertain").show();
});
$(".btn_networking").on("click", function(){
	$(".on_page").removeClass("on_page");
	$(this).addClass("on_page");
	$(".right_bot_line").hide();
	$(".networking").show();
	$(".data_networking").show();
});
$(".btn_others").on("click", function(){
	$(".on_page").removeClass("on_page");
	$(this).addClass("on_page");
	$(".right_bot_line").hide();
	$(".others").show();
	$(".data_others").show();
});