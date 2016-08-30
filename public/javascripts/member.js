$('.member_menu_all').on('click', function(){
	var form = document.createElement("form");
	
	var input = document.createElement("input");
	form.setAttribute("method", "get");
	form.setAttribute("action", "/members");
	input.type = "hidden";
	input.name = "order";
	input.value = 0;
	form.appendChild(input);
	
	document.body.appendChild(form);
	form.submit();
	
});

$('.member_menu_1').on('click', function(){
	var form = document.createElement("form");
	
	var input = document.createElement("input");
	form.setAttribute("method", "get");
	form.setAttribute("action", "/members");
	input.type = "hidden";
	input.name = "order";
	input.value = 1;
	form.appendChild(input);
	
	document.body.appendChild(form);
	form.submit();
});

$('.member_menu_2').on('click', function(){
	var form = document.createElement("form");
	
	var input = document.createElement("input");
	form.setAttribute("method", "get");
	form.setAttribute("action", "/members");
	input.type = "hidden";
	input.name = "order";
	input.value = 2;
	form.appendChild(input);
	
	document.body.appendChild(form);
	form.submit();
});

$('.member_menu_3').on('click', function(){
	var form = document.createElement("form");
	
	var input = document.createElement("input");
	form.setAttribute("method", "get");
	form.setAttribute("action", "/members");
	input.type = "hidden";
	input.name = "order";
	input.value = 3;
	form.appendChild(input);
	
	document.body.appendChild(form);
	form.submit();
});

