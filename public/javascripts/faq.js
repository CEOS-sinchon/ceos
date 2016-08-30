$(document).ready(function(){

});

$('.board_text_line').on('click', function(){
	$(this).find('.board_text').show();
});

$('.board_up_btn').on('click', function(){
	$(this).parents('.board_text').hide('normal');
});

$('.board_data_search_btn').on('click', function(){

});