$(document).ready(function(){
});

$(".left_menu").on("mouseover", function(){
	$(this).addClass("active");
});

$(".left_menu").on("mouseout", function(){
	$(this).removeClass("active");
});

$('.logo_box').on('click', function(){
	location.replace("/"); 
});

$(".menu_about").on('click', function(){
	location.replace("/about/philo"); 
});
$(".menu_board").on('click', function(){
	location.replace("/board/notice"); 
});
$(".menu_mem").on('click', function(){
	location.replace("/members"); 
});
$(".menu_act").on('click', function(){
	location.replace("/activity");
});
$(".menu_rec").on('click', function(){
	location.replace("/recruit"); 
});
$(".menu_con").on('click', function(){

});
