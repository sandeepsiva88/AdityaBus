$(document).ready(function(){
	$('.remove').click(function(){
		var id=$(this).val()
			$.post('/remove', {no:id}, function(docs){
				location.reload('/');
		});
	});
});