	//TODO: move to react framework
	var postingsPromise = $.get('/posting/all', function(postings) {
		postings[0].forEach(function(el, idx) {
			$('#code_links').append(
					$("<li class='list-group-item'><a href='/code/"+ el.postingId + "' class='al' id='" + el.postingId + "'><strong>"+ el.title + "</strong></a></li>"));
		});
	});

	// change link cover on hover
	$('.list-group-item').hover(function(e) {
		$(this).css('background-color', '#99ccff');
	}, function(e) {
		$(this).css('background-color', 'white');
	});
