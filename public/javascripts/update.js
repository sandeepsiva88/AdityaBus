$(document).ready(function(){
	$('.edit').click(function(){
		var id=$(this).val()
			$.post('/edit', {no:id}, function(docs){
			var stringifiedData=JSON.stringify(docs)
			var parsedData=JSON.parse(stringifiedData);
			$('#id').val(parsedData[0]._id);
			$('#busno').val(parsedData[0].BusNo);
			$('#tag').val(parsedData[0].Tagid);
			$('#status').val(parsedData[0].Status);
		});
	});
	
});