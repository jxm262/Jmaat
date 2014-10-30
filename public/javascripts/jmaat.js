var Jmaat = Jmaat || {};

// TODO: move this to react framework
Jmaat.postingsPromise = $.get('/api/posting/all', function(postings) {
	postings[0].forEach(function(el, idx) {
		$('#code_links').append(
				$("<li class='list-group-item'><a href='/code/" + el.postingId + "' class='al' id='" + el.postingId + "'><strong>" + el.title + "</strong></a></li>"));
	});
	
	$('.list-group-item').hover(function(e) {
		$(this).css('background-color', '#99ccff');
	}, function(e) {
		$(this).css('background-color', 'white');
	});
});

Jmaat.ajaxFail = function(jqXHR, textStatus, errorThrown) {
	console.log("Failed - textStatus: " + textStatus);
	console.log("errorThrown - " + errorThrown);
	console.log(jqXHR);
}
