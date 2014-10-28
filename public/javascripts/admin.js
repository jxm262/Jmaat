//(function() {

	postingsPromise.done(function(){
		$(".al").click(function(e){
			event.preventDefault();
			var postingId = $(this).attr("id");
			
			$.get("/../posting/" + postingId, function(obj){
				$("#posting_id").val(obj[0][0].postingId);
				$("#title").val(obj[0][0].title);
				$("#text").val(obj[0][0].text);
			});
		});
	});

	$("#submit").click(function(event){
		event.preventDefault();
		
		var posting = {postingId: $("#posting_id").val(), title: $("#title").val(), text: $("#text").val()};

		$.ajax({
			type : "POST",
			url : "../posting/save",
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(posting),
			dataType : "json",
			success : function(data) {
				if(data.success){
					alert("Added Successfully");
				} else{
					alert("Had error somewhere");
				}
				
				$("#posting_id").val("");
				$("#title").val("");
				$("#text").val("");
			},
			fail: function(jqXHR, textStatus, errorThrown) {
				console.log("Failed - textStatus: " + textStatus);
				console.log("errorThrown - " + errorThrown);
				console.log(jqXHR);
			}
		});
	});
	
	
//})();