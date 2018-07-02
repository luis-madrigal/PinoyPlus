$(document).ready(function(){
	$(".footer").fadeIn(1000, function() {
		$("#large-text").fadeIn(2000);
		$("#sub-text").fadeIn(3000, function() {
			$("#login-form").fadeIn(500);
		});
	});
});